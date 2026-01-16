/**
 * Contentstack Content Type Interfaces
 */

// Author Types
export interface ContentstackAuthor {
  uid: string;
  title: string;
  author_id: number; // Changed to number to match actual API response
  full_name: string;
  role: string;
  team: Array<{
    uid: string;
    _content_type_uid: string;
    team_name?: string; // Optional, only present if populated
    team_value?: string; // Optional, only present if populated
  }>;
  location?: string;
  avatar?: {
    url: string;
    filename: string;
  };
  bio?: string;
  email?: string;
  posts?: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Post Types
export interface ContentstackPost {
  uid: string;
  title: string;
  title_post: string;
  category: 'Insight' | 'Incident' | 'Retrospective';
  excerpt: string;
  featured: boolean;
  rating?: {
    value: number;
  };
  featured_image?: {
    url: string;
    filename: string;
    title?: string;
  };
  author_id: ContentstackAuthor[] | Array<{ uid: string; _content_type_uid: string }>; // Reference field (can be populated or just UIDs)
  tags_post: string; // Multiline text with newline-separated tags
  published_date: string;
  content: {
    context?: string;
    problem?: string;
    resolution?: string;
    achievements?: string;
    challenges?: string;
    improvements?: string;
    learnings?: string;
  };
  created_at: string;
  updated_at: string;
}

// Navbar Types
export interface NavbarContent {
  logo: {
    image: {
      logo_image: {
        url: string;
        title?: string;
        filename?: string;
      };
      alt_text: string;
    };
    brand_text: string;
  };
  navigation: Array<{
    nav_links: {
      label: string;
      href: {
        title: string;
        href: string;
      };
    };
  }>;
  search: string;
  action_button: {
    button_text: string;
    button_link: {
      title: string;
      href: string;
    };
  };
  user_menu: {
    profile: {
      label: string;
      icon?: string | null;
    };
    logout: {
      label: string;
      icon?: string | null;
    };
  };
}

// Footer Types
export interface FooterContent {
  logo: {
    logo: {
      image: {
        url: string;
        title?: string;
        filename?: string;
      };
      logo_alt_text: string;
    };
    brand_name: string;
  };
  navigation_blocks: Array<{
    nav: {
      label: string;
      link: {
        title: string;
        href: string;
      };
    };
  }>;
  copyright_text: string;
}

// Homepage Types
export interface HomepageContent {
  hero: {
    title: string;
    title_highlight: string;
    subtitle: string;
    search_placeholder: string;
  };
  stats: {
    total_post: number;
    total_contributors: number;
    total_teams: number;
  };
  categories: {
    title: string;
    show_view_all_link: boolean;
  };
  featured_posts: {
    title: string;
    max_posts: number;
  };
  latest_posts: {
    title: string;
    show_see_all_posts: boolean;
    max_posts: number;
  };
  cta: {
    title: string;
    description: string;
    button_text: string;
    button_link: {
      title: string;
      href: string;
    };
  };
}

// Team Types
export interface ContentstackTeam {
  team_name: string;
  display_order: number;
  uid: string;
}

// Category Types
export interface ContentstackCategory {
  category_value: string;
  category_label: string;
  display_order: number;
  uid: string;
}

// Create Post Page Types
export interface CreatePostContent {
  page_header: {
    page_title: string;
  };
  action_buttons: {
    save_draft_button: string;
    publish_button: string;
  };
  form_labels: {
    title_label: string;
    title_placeholder: string;
    excerpt_label: string;
    excerpt_placeholder: string;
    excerpt_help_text: string;
    post_type_label: string;
    post_type_placeholder: string;
    post_type_help_text: string;
    tags_label: string;
    tags_help_text: string;
    custom_tags_label: string;
    custom_tags_placeholder: string;
    custom_tags_help_text: string;
  };
  content_section: {
    section_title: string;
    section_subtitle: string;
  };
  context_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  problem_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  resolution_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  achievements_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  challenges_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  improvements_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  learnings_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  writing_tips: {
    tips_title: string;
    tips_list: string;
  };
  toast_messages: {
    draft_saved_title: string;
    draft_saved_description: string;
    published_title: string;
    published_description: string;
    missing_fields_title: string;
    missing_fields_description: string;
  };
}

// Edit Post Page Types
export interface EditPostContent {
  page_header: {
    page_title: string;
  };
  action_buttons: {
    save_draft_button: string;
    publish_button: string;
  };
  form_labels: {
    title_label: string;
    title_placeholder: string;
    excerpt_label: string;
    excerpt_placeholder: string;
    excerpt_help_text: string;
    post_type_label: string;
    post_type_placeholder: string;
    team_label: string;
    team_help_text: string;
    tags_label: string;
    tags_help_text: string;
    custom_tags_label: string;
    custom_tags_placeholder: string;
    custom_tags_help_text: string;
  };
  content_section: {
    section_title: string;
    section_subtitle: string;
  };
  context_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  problem_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  resolution_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  achievements_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  challenges_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  improvements_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  learnings_section: {
    label: string;
    description: string;
    placeholder: string;
  };
  writing_tips: {
    tips_title: string;
    tips_list: string;
  };
  toast_messages: {
    draft_saved_title: string;
    draft_saved_description: string;
    updated_title: string;
    updated_description: string;
    missing_fields_title: string;
    missing_fields_description: string;
    not_found_title: string;
    not_found_description: string;
  };
}

// Profile Page Types
export interface ProfilePageContent {
  navigation: {
    back_button_text: string;
  };
  profile_header: {
    theme_toggle_label: string;
  };
  stats_section: {
    posts_label: string;
    content_minutes_label: string;
  };
  posts_section: {
    section_title_prefix: string;
    edit_button_text: string;
    empty_state_message: string;
  };
  not_found: {
    title: string;
    button_text: string;
  };
}

// Browse Page Types
export interface BrowsePageContent {
  header: {
    page_title: string;
    page_subtitle: string;
  };
  search_section: {
    search_placeholder: string;
    team_filter_label: string;
    category_filter_label: string;
    all_categories_text: string;
  };
  results_section: {
    result_text_singular: string;
    result_text_plural: string;
    clear_filters_button: string;
  };
  empty_state: {
    empty_message: string;
    empty_button_text: string;
  };
}

// About Page Types
export interface AboutPageContent {
  header: {
    title: string;
    subtitle: string;
  };
  purpose: {
    title: string;
    paragraph_1: string;
    paragraph_2: string;
  };
  contenttype_section: {
    heading: string;
    insight_card: {
      title: string;
      description: string;
    };
    incident_card: {
      title: string;
      description: string;
    };
    retrospective_card: {
      title: string;
      description: string;
    };
  };
  guidelines_section: {
    heading: string;
    intro_text: string;
    do_items: {
      title: string;
      items: string;
    };
    dont_item: {
      title: string;
      items: string;
    };
  };
  structure_section: {
    heading: string;
    intro_text: string;
    items: string;
  };
  cta: {
    title: string;
    description: string;
    button_text: string;
    button_link: {
      title: string;
      href: string;
    };
  };
}
