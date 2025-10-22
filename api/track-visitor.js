export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { country, city, latitude, longitude, ip } = req.body;

    // 验证必填字段
    if (!country || !city || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 获取环境变量
    const TOKEN = process.env.GITHUB_TOKEN;
    const GIST_ID = process.env.GIST_ID;
    const USERNAME = process.env.GITHUB_USERNAME;

    if (!TOKEN || !GIST_ID || !USERNAME) {
      console.error('Missing environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 获取当前Gist内容
    const gistResponse = await fetch(
      `https://api.github.com/gists/${GIST_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'visitor-tracker',
        },
      }
    );

    if (!gistResponse.ok) {
      throw new Error(`Failed to fetch gist: ${gistResponse.statusText}`);
    }

    const gistData = await gistResponse.json();
    const fileKey = Object.keys(gistData.files)[0];
    
    let content;
    try {
      content = JSON.parse(gistData.files[fileKey].content);
    } catch (e) {
      console.error('Failed to parse gist content:', e);
      throw new Error('Invalid gist content format');
    }

    // 确保visitors数组存在
    if (!Array.isArray(content.visitors)) {
      content.visitors = [];
    }

    // 创建新访问者记录
    const newVisitor = {
      timestamp: new Date().toISOString(),
      country,
      city,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      ip_hash: hashIP(ip), // 不存储完整IP以保护隐私
    };

    // 添加到访问者列表
    content.visitors.push(newVisitor);
    content.updated_at = new Date().toISOString();

    // 可选：限制Gist大小（保留最近的1000条记录）
    if (content.visitors.length > 1000) {
      content.visitors = content.visitors.slice(-1000);
    }

    // 更新Gist
    const updateResponse = await fetch(
      `https://api.github.com/gists/${GIST_ID}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'visitor-tracker',
        },
        body: JSON.stringify({
          files: {
            [fileKey]: {
              content: JSON.stringify(content, null, 2),
            },
          },
          description: `Updated at ${new Date().toISOString()}`,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update gist: ${updateResponse.statusText}`);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Visitor tracked successfully',
      visitorCount: content.visitors.length 
    });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}

/**
 * 简单的IP哈希函数（保护隐私）
 * 确保相同的IP会生成相同的哈希，但无法反向获取原始IP
 */
function hashIP(ip) {
  if (!ip) return 'unknown';
  
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
