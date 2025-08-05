export interface GroupInfo {
  age_verification_beta_code: string | null;
  age_verification_beta_slots: number | null;
  age_verification_slots_available: number | null;
  badges: any[];
  banner_id: string;
  banner_url: string;
  created_at: string;
  description: string;
  discriminator: string;
  galleries: Gallery[];
  icon_id: string;
  icon_url: string;
  id: string;
  is_verified: boolean;
  join_state: string;
  languages: string[];
  last_post_created_at: string;
  links: string[];
  member_count: number;
  member_count_synced_at: string;
  membership_status: string;
  my_member: any;
  name: string;
  online_member_count: number;
  owner_id: string;
  privacy: string;
  roles: any;
  rules: string;
  short_code: string;
  tags: any[];
  transfer_target_id: string | null;
  updated_at: string | null;
}

export interface Gallery {
  created_at: string;
  description: string;
  id: string;
  members_only: boolean;
  name: string;
  role_ids_to_auto_approve: any[];
  role_ids_to_manage: any[];
  role_ids_to_submit: any[];
  role_ids_to_view: any;
  updated_at: string;
}

export interface GroupPost {
  author_id: string;
  created_at: string;
  editor_id: string | null;
  group_id: string;
  id: string;
  image_id: string;
  image_url: string;
  role_id: string | null;
  text: string;
  title: string;
  updated_at: string;
  visibility: string;
}

export interface ApiResponse {
  group_info: GroupInfo;
  group_posts: GroupPost[];
  group_instances: GroupInstance[];
  galleryImages: string[];
  last_updated: string;
}

export interface GroupInstance {
  instance_id: string;
  location: string;
  world: World;
  member_count: number;
  detailed_info: DetailedInstanceInfo;
  user_count: number;
}

export interface World {
  author_id: string;
  author_name: string;
  capacity: number;
  recommended_capacity: number;
  created_at: string;
  description: string;
  favorites: number;
  featured: boolean;
  heat: number;
  id: string;
  image_url: string;
  name: string;
  popularity: number;
  preview_youtube_id?: string;
  publication_date: string;
  release_status: string;
  tags: string[];
  thumbnail_image_url: string;
  updated_at: string;
  version: number;
  visits: number;
}

export interface DetailedInstanceInfo {
  active: boolean;
  capacity: number;
  display_name?: string;
  full: boolean;
  id: string;
  instance_id: string;
  location: string;
  n_users: number;
  name: string;
  owner_id: string;
  permanent: boolean;
  photon_region: string;
  platforms: {
    android: number;
    ios: number;
    standalonewindows: number;
  };
  region: string;
  type: string;
  world_id: string;
  queue_enabled: boolean;
  queue_size: number;
  recommended_capacity: number;
  user_count: number;
  group_access_type: string;
  has_capacity_for_you: boolean;
}