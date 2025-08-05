import vrchatapi
from vrchatapi.api import authentication_api, users_api
from vrchatapi.exceptions import UnauthorizedException
from vrchatapi.models.two_factor_auth_code import TwoFactorAuthCode
from vrchatapi.models.two_factor_email_code import TwoFactorEmailCode
import requests
import json
import time
import pyotp
from datetime import datetime, date
from config import USERNAME, PASSWORD, MAIL, secret_key, TELEGRAM_BOT_TOKEN

# Configuration
TARGET_USER_ID = "usr_a7fa556f-b68e-4365-9ad3-c745c6e4f10d"
TELEGRAM_CHAT_ID = "5627028720"
CHECK_INTERVAL = 60  # seconds
DATA_FILE = "user_data.json"

def send_telegram_message(message):
    """Send message to Telegram"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"✓ Telegram message sent: {message[:50]}...")
        else:
            print(f"✗ Failed to send Telegram message: {response.status_code}")
    except Exception as e:
        print(f"✗ Error sending Telegram message: {e}")

def datetime_converter(obj):
    """Convert datetime and date objects to JSON serializable format"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, date):
        return obj.isoformat()
    return str(obj)

def load_previous_data():
    """Load previous user data from file"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error in previous data, starting fresh: {e}")
        # Delete corrupted file and start fresh
        try:
            import os
            os.remove(DATA_FILE)
            print(f"Removed corrupted file {DATA_FILE}")
        except:
            pass
        return None
    except Exception as e:
        print(f"Error loading previous data: {e}")
        return None

def save_current_data(data):
    """Save current user data to file"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2, default=datetime_converter)
    except Exception as e:
        print(f"Error saving data: {e}")

def clean_user_data(user_data):
    """Extract relevant fields for comparison"""
    if not user_data:
        return None
    
    # Convert datetime objects to strings for JSON serialization
    cleaned_data = {
        'id': user_data.get('id'),
        'display_name': user_data.get('display_name'),
        'status': user_data.get('status'),
        'status_description': user_data.get('status_description'),
        'location': user_data.get('location'),
        'world_id': user_data.get('world_id'),
        'instance_id': user_data.get('instance_id'),
        'last_platform': user_data.get('last_platform'),
        'bio': user_data.get('bio'),
        'bio_links': user_data.get('bio_links'),
        'profile_pic_override': user_data.get('profile_pic_override'),
        'current_avatar_image_url': user_data.get('current_avatar_image_url'),
        'current_avatar_thumbnail_image_url': user_data.get('current_avatar_thumbnail_image_url')
    }
    
    # Handle datetime fields specially
    last_login = user_data.get('last_login')
    if isinstance(last_login, (datetime, date)):
        cleaned_data['last_login'] = last_login.isoformat()
    else:
        cleaned_data['last_login'] = last_login
    
    date_joined = user_data.get('date_joined')
    if isinstance(date_joined, (datetime, date)):
        cleaned_data['date_joined'] = date_joined.isoformat()
    else:
        cleaned_data['date_joined'] = date_joined
    
    return cleaned_data

def compare_user_data(old_data, new_data):
    """Compare user data and return list of changes"""
    if not old_data:
        return ["🎉 Started monitoring user"]
    
    changes = []
    
    # Check each field for changes
    fields_to_check = {
        'display_name': 'Display Name',
        'status': 'Status',
        'status_description': 'Status Description',
        'location': 'Location',
        'world_id': 'World',
        'instance_id': 'Instance',
        'last_platform': 'Platform',
        'bio': 'Bio',
        'profile_pic_override': 'Profile Picture',
        'current_avatar_image_url': 'Avatar'
    }
    
    for field, display_name in fields_to_check.items():
        old_value = old_data.get(field)
        new_value = new_data.get(field)
        
        if old_value != new_value:
            if field == 'location':
                if old_value == 'offline' and new_value != 'offline':
                    changes.append(f"🟢 User came online: {new_value}")
                elif old_value != 'offline' and new_value == 'offline':
                    changes.append(f"🔴 User went offline")
                elif old_value != new_value and new_value != 'offline':
                    changes.append(f"🌍 Location changed: {new_value}")
            elif field == 'status':
                status_emoji = {
                    'active': '🟢',
                    'join me': '🔵', 
                    'ask me': '🟡',
                    'busy': '🔴',
                    'offline': '⚫'
                }
                emoji = status_emoji.get(new_value, '📱')
                changes.append(f"{emoji} Status: {old_value} → {new_value}")
            elif field == 'display_name':
                changes.append(f"📝 {display_name}: {old_value} → {new_value}")
            elif field == 'status_description':
                changes.append(f"💬 Status Message: '{old_value}' → '{new_value}'")
            elif field == 'last_platform':
                changes.append(f"🖥️ Platform: {old_value} → {new_value}")
            elif field == 'bio':
                changes.append(f"📄 Bio updated")
            elif field in ['profile_pic_override', 'current_avatar_image_url']:
                changes.append(f"🎭 Avatar changed")
    
    return changes

def authenticate_vrchat():
    """Authenticate with VRChat API"""
    configuration = vrchatapi.Configuration(
        username=USERNAME,
        password=PASSWORD,
    )
    
    TOTP_SECRET = secret_key
    totp = pyotp.TOTP(TOTP_SECRET)
    
    api_client = vrchatapi.ApiClient(configuration)
    api_client.user_agent = "UserMonitor/1.0 " + MAIL
    
    auth_api = authentication_api.AuthenticationApi(api_client)
    
    try:
        current_user = auth_api.get_current_user()
        print(f"✓ Authenticated as: {current_user.display_name}")
        return api_client
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
            print(f"✓ Authenticated as: {current_user.display_name}")
            return api_client
        else:
            print(f"Authentication failed: {e}")
            return None
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

def monitor_user():
    """Main monitoring function"""
    print(f"🔍 Starting VRChat user monitor for {TARGET_USER_ID}")
    print(f"📱 Telegram notifications will be sent to chat {TELEGRAM_CHAT_ID}")
    print(f"⏱️ Check interval: {CHECK_INTERVAL} seconds")
    
    # Authenticate once
    api_client = authenticate_vrchat()
    if not api_client:
        print("❌ Failed to authenticate with VRChat")
        return
    
    users_api_instance = users_api.UsersApi(api_client)
    
    # Send startup notification
    send_telegram_message("🤖 VRChat User Monitor Started\n"
                         f"👤 Monitoring: {TARGET_USER_ID}\n"
                         f"⏰ Check interval: {CHECK_INTERVAL}s")
    
    # Load previous data
    previous_data = load_previous_data()
    
    while True:
        try:
            print(f"\n🔄 Checking user status at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Get user information
            user_info = users_api_instance.get_user(TARGET_USER_ID)
            current_data = clean_user_data(user_info.to_dict())
            
            # Compare with previous data
            changes = compare_user_data(previous_data, current_data)
            
            if changes:
                print(f"📢 Found {len(changes)} changes:")
                for change in changes:
                    print(f"  • {change}")
                
                # Send notification to Telegram
                message = f"🔔 <b>VRChat User Update</b>\n"
                message += f"👤 User: {current_data.get('display_name', 'Unknown')}\n"
                message += f"🕐 Time: {datetime.now().strftime('%H:%M:%S')}\n\n"
                
                for change in changes:
                    message += f"• {change}\n"
                
                send_telegram_message(message)
            else:
                print("✓ No changes detected")
            
            # Save current data for next comparison
            save_current_data(current_data)
            previous_data = current_data
            
        except vrchatapi.ApiException as e:
            error_msg = f"❌ VRChat API Error: {e.status} - {e.reason}"
            print(error_msg)
            
            if e.status == 404:
                print("User not found or not accessible")
                send_telegram_message("⚠️ User not found or profile is private")
            elif e.status == 401:
                print("Authentication expired, attempting to re-authenticate...")
                api_client = authenticate_vrchat()
                if api_client:
                    users_api_instance = users_api.UsersApi(api_client)
                    continue
                else:
                    send_telegram_message("❌ Authentication failed, monitor stopped")
                    break
            else:
                send_telegram_message(f"❌ API Error: {e.status}")
                
        except KeyboardInterrupt:
            print("\n🛑 Monitor stopped by user")
            send_telegram_message("🛑 VRChat User Monitor Stopped")
            break
        except Exception as e:
            error_msg = f"❌ Unexpected error: {e}"
            print(error_msg)
            send_telegram_message(f"❌ Monitor Error: {str(e)[:100]}...")
        
        # Wait before next check
        try:
            time.sleep(CHECK_INTERVAL)
        except KeyboardInterrupt:
            print("\n🛑 Monitor stopped by user")
            send_telegram_message("🛑 VRChat User Monitor Stopped")
            break

if __name__ == "__main__":
    monitor_user()