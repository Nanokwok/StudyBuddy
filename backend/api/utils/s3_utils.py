from django.conf import settings

def get_full_s3_url(path_or_url):
    """
    Convert S3 path to full URL if needed
    Args:
        path_or_url: Either a full URL or S3 path (profile_pictures/xxx.jpg)
    Returns:
        Full public URL (https://bucket.s3.amazonaws.com/profile_pictures/xxx.jpg)
    """
    if not path_or_url:
        return None

    # Handle FileField/ImageField objects
    if hasattr(path_or_url, 'url'):
        path_or_url = path_or_url.url

    # Convert to string if not already
    path_or_url = str(path_or_url)

    # Remove any existing domain prefix to prevent double URLs
    if settings.AWS_S3_CUSTOM_DOMAIN in path_or_url:
        path_or_url = path_or_url.split(settings.AWS_S3_CUSTOM_DOMAIN)[-1].lstrip('/')

    # If it's already a full URL, return as-is
    if path_or_url.startswith('http'):
        return path_or_url

    # Otherwise construct the full URL
    return f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{path_or_url.lstrip('/')}"