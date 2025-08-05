import vrchatapi
from vrchatapi.api import authentication_api, groups_api, instances_api
from vrchatapi.exceptions import UnauthorizedException
from vrchatapi.models.two_factor_auth_code import TwoFactorAuthCode
from vrchatapi.models.two_factor_email_code import TwoFactorEmailCode
from config import secret_key, USERNAME, PASSWORD, MAIL
import pyotp
import json
from datetime import datetime

def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()
    return str(o)

def clean_world_data(world_dict):
    """Helper function to remove unity_packages from world data"""
    if isinstance(world_dict, dict):
        if 'unity_packages' in world_dict:
            del world_dict['unity_packages']
        return world_dict
    return world_dict

# Configuration
configuration = vrchatapi.Configuration(
    username=USERNAME,
    password=PASSWORD,
)

# 2FA setup
TOTP_SECRET = secret_key
totp = pyotp.TOTP(TOTP_SECRET)

# Group ID
GROUP_ID = "grp_33acd584-97b9-42de-8aa9-88aceaa216dc"
JSON_FILE = "group_data.json"

# API Client context
with vrchatapi.ApiClient(configuration) as api_client:
    api_client.user_agent = "GroupInfoFetcher/1.0 " + MAIL
    
    # Authentication
    auth_api = authentication_api.AuthenticationApi(api_client)
    
    try:
        current_user = auth_api.get_current_user()
    except UnauthorizedException as e:
        if e.status == 200:
            if "Email 2 Factor Authentication" in e.reason:
                code = input("Email 2FA Code: ")
                auth_api.verify2_fa_email_code(two_factor_email_code=TwoFactorEmailCode(code))
            elif "2 Factor Authentication" in e.reason:
                code = totp.now()
                print(f"Generated 2FA code: {code}")
                auth_api.verify2_fa(two_factor_auth_code=TwoFactorAuthCode(code))
            current_user = auth_api.get_current_user()
        else:
            print("Exception when calling API:", e)
            exit()
    except vrchatapi.ApiException as e:
        print("Exception when calling API:", e)
        exit()
    
    print("Logged in as:", current_user.display_name)
    
    try:
        groups_api_instance = groups_api.GroupsApi(api_client)
        instances_api_instance = instances_api.InstancesApi(api_client)
        
        # Get basic group info
        group_info = groups_api_instance.get_group(GROUP_ID)
        group_posts = groups_api_instance.get_group_posts(
            group_id=GROUP_ID,
            n=6,
            offset=0, 
        )
        group_instances = groups_api_instance.get_group_instances(GROUP_ID)
        
        # Enhanced instance data collection
        instances_data = []
        for instance in group_instances:
            # Get basic instance info
            instance_dict = instance.to_dict()
            
            # Extract world_id and instance_id from location
            location_parts = instance.location.split(':')
            world_id = location_parts[0]
            instance_id = location_parts[1] if len(location_parts) > 1 else None
            
            # Get detailed instance information
            try:
                instance_details = instances_api_instance.get_instance(
                    world_id=world_id,
                    instance_id=instance_id
                )
                detailed_info = instance_details.to_dict()
                
                # Clean world data in detailed info if it exists
                if 'world' in detailed_info and detailed_info['world']:
                    detailed_info['world'] = clean_world_data(detailed_info['world'])
                
                instance_dict['detailed_info'] = detailed_info
                
                # Add user count if available
                if hasattr(instance_details, 'n_users') and instance_details.n_users is not None:
                    instance_dict['user_count'] = instance_details.n_users
            except vrchatapi.ApiException as e:
                print(f"Failed to get instance details for {instance_id}: {e}")
                instance_dict['detailed_info'] = None
            
            # Process world info
            if 'world' in instance_dict and instance_dict['world']:
                instance_dict['world'] = clean_world_data(instance_dict['world'])
            
            instances_data.append(instance_dict)
        
        # Prepare data for saving
        data = {
            "last_updated": datetime.utcnow().isoformat(),
            "group_info": group_info.to_dict(),
            "group_posts": [post.to_dict() for post in group_posts.posts],
            "group_instances": instances_data
        }
        
        # Save to JSON file
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4, default=datetime_converter)
            
        print(f"Data successfully saved to {JSON_FILE}")
        
    except vrchatapi.ApiException as e:
        print("Exception when calling API:", e)