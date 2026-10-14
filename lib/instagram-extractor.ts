const ENCODING_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function decodeEscaped(str?: string | null): string | null {
  if (!str) return null;
  let s = str.replace(/\\\//g, '/').replace(/\\u0025/g, '%').replace(/\\u0026/g, '&');
  try {
    s = JSON.parse(`"${str}"`);
  } catch {}
  return s.replace(/&amp;/g, '&');
}

function getMetaContent(html: string, attrValue: string): string | null {
  const escaped = attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const r1 = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i');
  const r2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i');
  const m = html.match(r1) || html.match(r2);
  return m ? decodeEscaped(m[1]) : null;
}

export function shortcodeToPk(shortcode: string): string {
  let cleanCode = shortcode;
  if (cleanCode.length > 28) {
    cleanCode = cleanCode.slice(0, -28);
  }
  const base = BigInt(64);
  let pk = BigInt(0);
  for (let i = 0; i < cleanCode.length; i++) {
    const char = cleanCode[i];
    const index = BigInt(ENCODING_CHARS.indexOf(char));
    if (index === BigInt(-1)) continue;
    pk = pk * base + index;
  }
  return pk.toString();
}

export function detectPlatform(input: string): 'facebook' | 'instagram' | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (/(?:facebook\.com|fb\.watch|fb\.me)\b/i.test(trimmed)) {
    return 'facebook';
  }
  if (/(?:instagram\.com|instagr\.am)\b/i.test(trimmed) || /^[A-Za-z0-9_-]{9,20}$/.test(trimmed)) {
    return 'instagram';
  }
  return null;
}

export function parseInstagramUrl(input: string) {
  if (!input || typeof input !== 'string') return null;

  const urlMatch =
    input.match(/https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:p|reel|reels|tv|share\/[a-zA-Z0-9_-]+)\/([A-Za-z0-9_-]+)/i) ||
    input.match(/https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:[a-zA-Z0-9._-]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);

  if (urlMatch) {
    const shortcode = urlMatch[1];
    return {
      platform: 'instagram' as const,
      shortcode,
      id: shortcode,
      canonicalUrl: `https://www.instagram.com/p/${shortcode}/`,
      type: input.includes('/reel/') || input.includes('/reels/') ? 'reel' : 'post',
    };
  }

  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{9,20}$/.test(trimmed)) {
    return {
      platform: 'instagram' as const,
      shortcode: trimmed,
      id: trimmed,
      canonicalUrl: `https://www.instagram.com/p/${trimmed}/`,
      type: 'post',
    };
  }

  return null;
}

export function parseFacebookUrl(input: string) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  const isFb = /(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:facebook\.com|fb\.watch|fb\.me)\b/i.test(trimmed);
  if (!isFb) return null;

  const urlMatch = trimmed.match(/https?:\/\/(?:[a-zA-Z0-9-]+\.)?(?:facebook\.com|fb\.watch|fb\.me)\/[^\s<>"']+/i);
  const targetUrl = urlMatch ? urlMatch[0] : trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;

  let type = 'video';
  if (targetUrl.includes('/reel/') || targetUrl.includes('/share/r/')) {
    type = 'reel';
  } else if (targetUrl.includes('/photo') || targetUrl.includes('/photos/')) {
    type = 'photo';
  } else if (targetUrl.includes('/posts/') || targetUrl.includes('/story.php')) {
    type = 'post';
  }

  let id = 'facebook_media';
  const idMatch =
    targetUrl.match(/(?:videos|reel|watch|posts|photos|r|v)\/(?:[^\s/?#]+\/)?([0-9A-Za-z_-]+)/i) ||
    targetUrl.match(/[?&](?:v|story_fbid|fbid)=([0-9A-Za-z_-]+)/i) ||
    targetUrl.match(/fb\.watch\/([0-9A-Za-z_-]+)/i);

  if (idMatch) {
    id = idMatch[1];
  } else {
    id = `fb_${Date.now()}`;
  }

  return {
    platform: 'facebook' as const,
    id,
    shortcode: id,
    canonicalUrl: targetUrl,
    type,
  };
}

export function parseSocialUrl(input: string) {
  const platform = detectPlatform(input);
  if (platform === 'facebook') return parseFacebookUrl(input);
  if (platform === 'instagram') return parseInstagramUrl(input);
  return null;
}

async function fetchViaInstagramSession(shortcode: string, sessionId?: string | null) {
  if (!sessionId) return null;
  const pk = shortcodeToPk(shortcode);

  let cookieHeader = sessionId.trim();
  const userIdMatch =
    cookieHeader.match(/(\d{6,})%3A/) ||
    cookieHeader.match(/(\d{6,}):/) ||
    cookieHeader.match(/ds_user_id=(\d+)/);
  if (!cookieHeader.includes('sessionid=')) {
    cookieHeader = `sessionid=${cookieHeader}`;
  }
  if (userIdMatch && !cookieHeader.includes('ds_user_id=')) {
    cookieHeader = `${cookieHeader}; ds_user_id=${userIdMatch[1]}`;
  }

  try {
    const apiUrl = `https://i.instagram.com/api/v1/media/${pk}/info/`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Instagram 319.0.0.38.109 (iPhone14,3; iOS 17_4; en_US; en-US; scale=3.00; 1284x2778; 576822237)',
        'X-IG-App-ID': '124024574287414',
        'X-ASBD-ID': '359341',
        'X-IG-WWW-Claim': '0',
        Cookie: cookieHeader,
        Accept: '*/*',
        'Accept-Language': 'en-US',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.items && data.items.length > 0) {
        const item = data.items[0];
        const author = {
          username: item.user?.username || 'instagram_user',
          fullName: item.user?.full_name || '',
          avatar: item.user?.profile_pic_url || null,
        };
        const caption = item.caption?.text || '';

        if (item.carousel_media && Array.isArray(item.carousel_media) && item.carousel_media.length > 0) {
          const media = item.carousel_media.map((child: any, idx: number) => {
            const isVideo = child.media_type === 2 || !!child.video_versions;
            const downloadUrl =
              isVideo && child.video_versions?.[0]
                ? child.video_versions[0].url
                : child.image_versions2?.candidates?.[0]?.url;
            const thumb = child.image_versions2?.candidates?.[0]?.url || downloadUrl;
            return {
              type: isVideo ? ('video' as const) : ('image' as const),
              url: downloadUrl,
              thumbnail: thumb,
              width: child.original_width || 1080,
              height: child.original_height || 1080,
              filename: `grabflow_${shortcode}_${idx + 1}.${isVideo ? 'mp4' : 'jpg'}`,
            };
          });

          return {
            success: true,
            platform: 'instagram' as const,
            engine: 'instagram_authenticated_mobile',
            shortcode,
            id: shortcode,
            url: `https://www.instagram.com/p/${shortcode}/`,
            type: 'carousel' as const,
            author,
            caption,
            media,
          };
        }

        const isVideo = item.media_type === 2 || !!item.video_versions;
        const downloadUrl =
          isVideo && item.video_versions?.[0]
            ? item.video_versions[0].url
            : item.image_versions2?.candidates?.[0]?.url;
        const thumb = item.image_versions2?.candidates?.[0]?.url || downloadUrl;

        return {
          success: true,
          platform: 'instagram' as const,
          engine: 'instagram_authenticated_mobile',
          shortcode,
          id: shortcode,
          url: `https://www.instagram.com/p/${shortcode}/`,
          type: isVideo ? ('video' as const) : ('image' as const),
          author,
          caption,
          media: [
            {
              type: isVideo ? ('video' as const) : ('image' as const),
              url: downloadUrl,
              thumbnail: thumb,
              width: item.original_width || 1080,
              height: item.original_height || 1920,
              filename: `grabflow_${shortcode}_1.${isVideo ? 'mp4' : 'jpg'}`,
            },
          ],
        };
      }
    }
  } catch {}

  try {
    const gqlUrl = `https://www.instagram.com/graphql/query/?doc_id=20565867659069524&variables=${encodeURIComponent(JSON.stringify({ shortcode }))}`;
    const gqlRes = await fetch(gqlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'X-ASBD-ID': '129477',
        Cookie: cookieHeader,
        Accept: '*/*',
      },
    });

    if (gqlRes.ok) {
      const gqlData = await gqlRes.json();
      const mediaData = gqlData?.data?.xdt_shortcode_media;
      if (mediaData) {
        const author = {
          username: mediaData.owner?.username || 'instagram_user',
          fullName: mediaData.owner?.full_name || '',
          avatar: mediaData.owner?.profile_pic_url || null,
        };
        const caption = mediaData.edge_media_to_caption?.edges?.[0]?.node?.text || '';

        if (mediaData.edge_sidecar_to_children?.edges?.length > 0) {
          const media = mediaData.edge_sidecar_to_children.edges.map((edge: any, idx: number) => {
            const node = edge.node;
            const isVideo = node.is_video || !!node.video_url;
            const downloadUrl = isVideo ? node.video_url : node.display_url;
            return {
              type: isVideo ? ('video' as const) : ('image' as const),
              url: downloadUrl,
              thumbnail: node.display_url || downloadUrl,
              filename: `grabflow_${shortcode}_${idx + 1}.${isVideo ? 'mp4' : 'jpg'}`,
            };
          });

          return {
            success: true,
            platform: 'instagram' as const,
            engine: 'instagram_authenticated_web',
            shortcode,
            id: shortcode,
            url: `https://www.instagram.com/p/${shortcode}/`,
            type: 'carousel' as const,
            author,
            caption,
            media,
          };
        }

        const isVideo = mediaData.is_video || !!mediaData.video_url;
        const downloadUrl = isVideo ? mediaData.video_url : mediaData.display_url;
        return {
          success: true,
          platform: 'instagram' as const,
          engine: 'instagram_authenticated_web',
          shortcode,
          id: shortcode,
          url: `https://www.instagram.com/p/${shortcode}/`,
          type: isVideo ? ('video' as const) : ('image' as const),
          author,
          caption,
          media: [
            {
              type: isVideo ? ('video' as const) : ('image' as const),
              url: downloadUrl,
              thumbnail: mediaData.display_url || downloadUrl,
              filename: `grabflow_${shortcode}_1.${isVideo ? 'mp4' : 'jpg'}`,
            },
          ],
        };
      }
    }
  } catch {}

  return null;
}

async function fetchViaInstagramEmbed(shortcode: string) {
  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const html = await res.text();

    const userMatch = html.match(/class=["'][^"']*UsernameText[^"']*["'][^>]*>([^<]+)</i);
    const username = userMatch ? userMatch[1].trim() : 'instagram_user';

    const avatarMatch = html.match(/class=["'][^"']*EmbeddedMediaAvatarImage[^"']*["'][^>]+src=["']([^"']+)["']/i);
    const avatar = avatarMatch ? decodeEscaped(avatarMatch[1]) : null;

    const capMatch = html.match(/class=["'][^"']*Caption["'][^>]*>([\s\S]*?)<\/div>/i);
    const caption = capMatch
      ? capMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim()
      : '';

    const videoMatches = [...html.matchAll(/"video_url":\s*"([^"]+)"/g)]
      .map((m) => decodeEscaped(m[1]))
      .filter(Boolean) as string[];

    if (videoMatches.length > 0) {
      const displayMatches = [...html.matchAll(/"display_url":\s*"([^"]+)"/g)]
        .map((m) => decodeEscaped(m[1]))
        .filter(Boolean) as string[];
      return {
        success: true,
        platform: 'instagram' as const,
        engine: 'embed_regex_video',
        shortcode,
        id: shortcode,
        url: `https://www.instagram.com/p/${shortcode}/`,
        type: 'video' as const,
        author: { username, fullName: '', avatar },
        caption,
        media: [
          {
            type: 'video' as const,
            url: videoMatches[0],
            thumbnail: displayMatches[0] || videoMatches[0],
            filename: `grabflow_${shortcode}_1.mp4`,
          },
        ],
      };
    }

    const imgMatch = html.match(/class=["'][^"']*EmbeddedMediaImage[^"']*["'][^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      const cleanImg = decodeEscaped(imgMatch[1]) || imgMatch[1];
      return {
        success: true,
        platform: 'instagram' as const,
        engine: 'embed_image',
        shortcode,
        id: shortcode,
        url: `https://www.instagram.com/p/${shortcode}/`,
        type: 'image' as const,
        author: { username, fullName: '', avatar },
        caption,
        media: [
          {
            type: 'image' as const,
            url: cleanImg,
            thumbnail: cleanImg,
            filename: `grabflow_${shortcode}_1.jpg`,
          },
        ],
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function resolveFacebookShortlink(url: string): Promise<string> {
  if (!url || typeof url !== 'string') return url;
  const isShortlink = /(?:fb\.watch|fb\.me|\/share\/[rv]?\/)/i.test(url);
  if (!isShortlink) return url;

  async function tryResolve(target: string) {
    try {
      const res = await fetch(target, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(6000),
      });
      const location = res.headers.get('location');
      if (location) {
        return location.startsWith('http') ? location : new URL(location, 'https://www.facebook.com').toString();
      }
    } catch {}
    return null;
  }

  const resolved = await tryResolve(url);
  return resolved || url;
}

async function fetchViaNativeFacebook(url: string, id: string) {
  const targetUrlResolved = await resolveFacebookShortlink(url);

  async function parseHtml(targetUrl: string, userAgent: string) {
    const res = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    const rawTitle =
      getMetaContent(html, 'og:title') ||
      getMetaContent(html, 'twitter:title') ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
      'Facebook Media';
    const title = rawTitle.replace(/\s*\|\s*Facebook$/i, '').trim();
    const caption = getMetaContent(html, 'og:description') || getMetaContent(html, 'twitter:description') || title;

    const hdMatch =
      html.match(/browser_native_hd_url["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/playable_url_quality_hd["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/hd_src["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/hd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i);

    const sdMatch =
      html.match(/browser_native_sd_url["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/playable_url["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/sd_src["']?\s*:\s*["']([^"']+)["']/i) ||
      html.match(/sd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i);

    const ogVideo =
      getMetaContent(html, 'og:video') ||
      getMetaContent(html, 'og:video:secure_url') ||
      getMetaContent(html, 'og:video:url');

    const hdUrl = decodeEscaped(hdMatch?.[1]);
    const sdUrl = decodeEscaped(sdMatch?.[1]);
    const videoUrl = hdUrl || sdUrl || ogVideo;

    let thumbnail =
      getMetaContent(html, 'og:image') ||
      getMetaContent(html, 'og:image:secure_url') ||
      getMetaContent(html, 'twitter:image') ||
      null;

    if (!thumbnail) {
      const imgMatch = html.match(/https:[^"'\s\\]+fbcdn\.net[^"'\s\\]+\.(?:jpg|jpeg|png|webp)[^"'\s\\]*/i);
      if (imgMatch) thumbnail = decodeEscaped(imgMatch[0]);
    }

    let authorName = 'facebook_creator';
    const pipeParts = title.split('|').map((s) => s.trim()).filter(Boolean);
    if (pipeParts.length > 1) {
      const lastPart = pipeParts[pipeParts.length - 1];
      if (!lastPart.toLowerCase().includes('facebook') && lastPart.length < 60) {
        authorName = lastPart;
      }
    }

    if (videoUrl) {
      return {
        success: true,
        platform: 'facebook' as const,
        engine: 'facebook_native',
        id,
        shortcode: id,
        url: targetUrl,
        type: 'video' as const,
        author: { username: authorName, fullName: authorName, avatar: thumbnail },
        caption: caption || title,
        media: [
          {
            type: 'video' as const,
            url: videoUrl,
            thumbnail: thumbnail || videoUrl,
            quality: hdUrl ? 'HD' : 'SD',
            filename: `facebook_${id}_${hdUrl ? 'HD' : 'SD'}.mp4`,
          },
        ],
      };
    }

    if (thumbnail) {
      return {
        success: true,
        platform: 'facebook' as const,
        engine: 'facebook_native_photo',
        id,
        shortcode: id,
        url: targetUrl,
        type: 'image' as const,
        author: { username: authorName, fullName: authorName, avatar: thumbnail },
        caption: caption || title,
        media: [
          {
            type: 'image' as const,
            url: thumbnail,
            thumbnail,
            filename: `facebook_${id}.jpg`,
          },
        ],
      };
    }

    return null;
  }

  try {
    const desktopResult = await parseHtml(
      targetUrlResolved,
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    if (desktopResult) return desktopResult;
  } catch {}

  try {
    const mobileUrl = targetUrlResolved.replace(/(?:www\.|web\.)?facebook\.com/, 'm.facebook.com');
    const mobileResult = await parseHtml(
      mobileUrl,
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
    );
    if (mobileResult) return mobileResult;
  } catch {}

  return null;
}

async function fetchViaPublicResolver(url: string, shortcode: string, platform: 'instagram' | 'facebook' = 'instagram') {
  const mirrors = [
    `https://api.vkrdownloader.com/server?vkr=${encodeURIComponent(url)}`,
    `https://backend1.tioo.eu.org/igdl?url=${encodeURIComponent(url)}`,
  ];
  const filePrefix = platform === 'facebook' ? 'facebook' : 'grabflow';

  for (const mirror of mirrors) {
    try {
      const res = await fetch(mirror, {
        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const data = await res.json();

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const media = data.data
          .filter((item: any) => item.url)
          .map((item: any, idx: number) => {
            const isVid = item.type === 'video' || item.url.includes('.mp4');
            return {
              type: isVid ? ('video' as const) : ('image' as const),
              url: item.url,
              thumbnail: item.thumbnail || item.url,
              filename: `${filePrefix}_${shortcode}_${idx + 1}.${isVid ? 'mp4' : 'jpg'}`,
            };
          });
        if (media.length > 0) {
          return {
            success: true,
            platform,
            engine: 'public_resolver',
            shortcode,
            id: shortcode,
            url,
            type: media.length > 1 ? ('carousel' as const) : media[0].type,
            author: { username: `${platform}_creator`, fullName: '', avatar: null },
            caption: data.title || '',
            media,
          };
        }
      }

      if (data?.result && Array.isArray(data.result) && data.result.length > 0) {
        const media = data.result
          .filter((item: any) => item.url && item.url.length > 5)
          .map((item: any, idx: number) => {
            const isVid = item.url.includes('.mp4');
            return {
              type: isVid ? ('video' as const) : ('image' as const),
              url: item.url,
              thumbnail: item.thumbnail || item.url,
              filename: `${filePrefix}_${shortcode}_${idx + 1}.${isVid ? 'mp4' : 'jpg'}`,
            };
          });
        if (media.length > 0) {
          return {
            success: true,
            platform,
            engine: 'public_resolver',
            shortcode,
            id: shortcode,
            url,
            type: media.length > 1 ? ('carousel' as const) : media[0].type,
            author: { username: `${platform}_creator`, fullName: '', avatar: null },
            caption: '',
            media,
          };
        }
      }
    } catch {}
  }
  return null;
}

async function fetchViaCobalt(
  url: string,
  shortcode: string,
  customInstance?: string | null,
  apiKey?: string | null,
  platform: 'instagram' | 'facebook' = 'instagram'
) {
  const instance = (customInstance || process.env.COBALT_INSTANCE || '').trim().replace(/\/$/, '');
  if (!instance) return null;
  const filePrefix = platform === 'facebook' ? 'facebook' : 'grabflow';

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (apiKey) headers['Authorization'] = `Api-Key ${apiKey}`;

    const res = await fetch(`${instance}/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.status === 'redirect' || data.status === 'tunnel') {
      const isVid = data.url.includes('.mp4') || !data.url.includes('.jpg');
      return {
        success: true,
        platform,
        engine: 'cobalt',
        shortcode,
        id: shortcode,
        url,
        type: isVid ? ('video' as const) : ('image' as const),
        author: { username: `${platform}_creator`, fullName: '', avatar: null },
        caption: data.filename || '',
        media: [
          {
            type: isVid ? ('video' as const) : ('image' as const),
            url: data.url,
            thumbnail: data.url,
            filename: `${filePrefix}_${shortcode}_1.${isVid ? 'mp4' : 'jpg'}`,
          },
        ],
      };
    }

    if (data.status === 'picker' && Array.isArray(data.picker)) {
      const media = data.picker.map((item: any, idx: number) => {
        const isVid = item.type === 'video' || item.url.includes('.mp4');
        return {
          type: isVid ? ('video' as const) : ('image' as const),
          url: item.url,
          thumbnail: item.thumb || item.url,
          filename: `${filePrefix}_${shortcode}_${idx + 1}.${isVid ? 'mp4' : 'jpg'}`,
        };
      });
      return {
        success: true,
        platform,
        engine: 'cobalt_picker',
        shortcode,
        id: shortcode,
        url,
        type: 'carousel' as const,
        author: { username: `${platform}_creator`, fullName: '', avatar: null },
        caption: '',
        media,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function extractInstagramMedia(inputUrl: string, options: any = {}) {
  const parsed = parseInstagramUrl(inputUrl);
  if (!parsed) {
    throw new Error('Please provide a valid Instagram post, reel, or video link.');
  }

  const { shortcode, canonicalUrl } = parsed;
  const sessionId = options.sessionId || process.env.INSTAGRAM_SESSION_ID || null;
  const cobaltInstance = options.cobaltInstance || process.env.COBALT_INSTANCE || null;
  const cobaltApiKey = options.cobaltApiKey || process.env.COBALT_API_KEY || null;

  if (sessionId) {
    try {
      const sessionResult = await fetchViaInstagramSession(shortcode, sessionId);
      if (sessionResult && sessionResult.media?.length > 0) {
        return sessionResult;
      }
    } catch {}
  }

  const engines = [
    fetchViaInstagramEmbed(shortcode),
    fetchViaPublicResolver(canonicalUrl, shortcode, 'instagram'),
  ];

  if (cobaltInstance) {
    engines.push(fetchViaCobalt(canonicalUrl, shortcode, cobaltInstance, cobaltApiKey, 'instagram'));
  }

  const results = await Promise.allSettled(engines);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value && r.value.success && r.value.media?.length > 0) {
      return r.value;
    }
  }

  throw new Error('Unable to fetch media from this Instagram link right now.');
}

export async function extractFacebookMedia(inputUrl: string, options: any = {}) {
  const resolvedUrl = await resolveFacebookShortlink(inputUrl);
  const parsed = parseFacebookUrl(resolvedUrl) || parseFacebookUrl(inputUrl);
  if (!parsed) {
    throw new Error('Please provide a valid Facebook video, reel, or post link.');
  }

  const { canonicalUrl, id } = parsed;
  const cobaltInstance = options.cobaltInstance || process.env.COBALT_INSTANCE || null;
  const cobaltApiKey = options.cobaltApiKey || process.env.COBALT_API_KEY || null;

  try {
    const nativeResult = await fetchViaNativeFacebook(canonicalUrl, id);
    if (nativeResult && nativeResult.media?.length > 0) {
      return nativeResult;
    }
  } catch {}

  const engines = [fetchViaPublicResolver(canonicalUrl, id, 'facebook')];
  if (cobaltInstance) {
    engines.push(fetchViaCobalt(canonicalUrl, id, cobaltInstance, cobaltApiKey, 'facebook'));
  }

  const results = await Promise.allSettled(engines);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value && r.value.success && r.value.media?.length > 0) {
      return r.value;
    }
  }

  throw new Error('Unable to fetch media from this Facebook link. Make sure the video or post is public.');
}

export async function extractSocialMedia(inputUrl: string, options: any = {}) {
  const platform = detectPlatform(inputUrl);
  if (platform === 'facebook') {
    return extractFacebookMedia(inputUrl, options);
  }
  return extractInstagramMedia(inputUrl, options);
}
