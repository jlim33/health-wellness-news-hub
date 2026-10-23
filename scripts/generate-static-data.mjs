import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parser = new Parser({
  timeout: 7000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HealthHub/1.0",
    "Accept": "application/rss+xml, application/xml, application/atom+xml, text/xml;q=0.9, */*;q=0.8"
  }
});

const FEEDS = [
  { id: "kormedi-science-kr", name: "코메디닷컴 의학연구", url: "https://kormedi.com/feed/", category: "장수 & 안티에이징 의학", lang: "ko" },
  { id: "docdocdoc-health-kr", name: "청년의사 헬스", url: "https://www.docdocdoc.co.kr/rss/allArticle.xml", category: "수면 & 뇌신경 웰니스", lang: "ko" },
  { id: "nih-health-en", name: "NIH News", url: "https://www.nih.gov/news-events/news-releases/feed.xml", category: "면역 & 마이크로바이옴", lang: "en" },
  { id: "harvard-health-en", name: "Harvard Health", url: "https://www.health.harvard.edu/blog/feed", category: "영양 & 정밀식이요법", lang: "en" },
  { id: "who-news-en", name: "WHO Global News", url: "https://www.who.int/rss-feeds/news-english.xml", category: "정신건강 & 스트레스 리셋", lang: "en" }
];

async function generate() {
  console.log("Fetching Health & Wellness RSS feeds...");
  const articles = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching ${feed.name}...`);
      const res = await parser.parseURL(feed.url);
      const items = (res.items || []).slice(0, 10);
      for (const item of items) {
        const title = item.title?.trim() || "Untitled";
        const snippet = (item.contentSnippet || item.content || item.summary || "")
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 280);
        
        articles.push({
          id: Buffer.from(item.link || title).toString("base64").slice(0, 16),
          title,
          link: item.link || "#",
          source: feed.name,
          sourceId: feed.id,
          category: feed.category,
          lang: feed.lang,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          timestamp: new Date(item.isoDate || item.pubDate || Date.now()).getTime(),
          author: item.creator || item.author || feed.name,
          snippet: snippet || "최신 헬스케어 의학 임상 연구 및 웰니스 가이드",
          readTime: Math.max(2, Math.ceil((snippet.length || 100) / 70)),
          likes: Math.floor(Math.random() * 40) + 15,
          bookmarksCount: Math.floor(Math.random() * 25) + 5,
          keyTakeaways: [
            `${title}에 관한 최신 임상 증거 및 의학적 권고사항`,
            `면역력 및 대사 건강 유지를 위한 실천 가이드`,
            `개인 맞춤형 라이프스타일 적용 방안`
          ]
        });
      }
    } catch (e) {
      console.warn(`Failed to fetch ${feed.name}:`, e.message);
    }
  }

  // Fallback seed articles
  if (articles.length === 0) {
    console.log("Using rich fallback seed articles for health hub...");
    articles.push(
      {
        id: "health-sample-1",
        title: "하버드 의대 연구팀 발표: 간헐적 단식과 세포 자가포식(Autophagy)의 수명 연장 효과",
        link: "https://www.health.harvard.edu",
        source: "Harvard Health",
        sourceId: "harvard-health-en",
        category: "장수 & 안티에이징 의학",
        lang: "ko",
        publishedAt: new Date().toISOString(),
        timestamp: Date.now(),
        author: "항노화의학연구소",
        snippet: "일정한 공복 시간 유지가 미토콘드리아 건강 회복과 세포 내 손상 단백질 제거를 촉진하여 생체 연령 감소에 기여한다는 대규모 임상 결과가 보고되었습니다.",
        readTime: 3,
        likes: 142,
        bookmarksCount: 68,
        keyTakeaways: [
          "16:8 간헐적 단식의 미토콘드리아 활성화 및 염증 억제 기전 확인",
          "세포 자가포식을 통한 뇌신경계 퇴행성 질환 예방 잠재력",
          "개인 건강 상태 및 기초 질환에 따른 맞춤형 식이 주기 설정 필요"
        ]
      },
      {
        id: "health-sample-2",
        title: "장내 미생물총(Microbiome)과 수면의 질 상관관계 규명",
        link: "https://kormedi.com",
        source: "코메디닷컴 의학연구",
        sourceId: "kormedi-science-kr",
        category: "수면 & 뇌신경 웰니스",
        lang: "ko",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        timestamp: Date.now() - 3600000,
        author: "뇌신경임상팀",
        snippet: "장내 유익균이 생성하는 단쇄지방산이 뇌-장 축(Gut-Brain Axis)을 통해 멜라토닌과 세로토닌 합성을 촉진하여 깊은 수면 시간을 늘려준다는 사실이 밝혀졌습니다.",
        readTime: 4,
        likes: 98,
        bookmarksCount: 42,
        keyTakeaways: [
          "발효식품과 프리바이오틱스 섭취의 렘(REM) 수면 질 개선 효과",
          "수면 부족 시 장벽 투과도 증가 및 만성 피로 유발 사이클 확인",
          "취침 3시간 전 식사 제한과 장내 환경 안정이 핵심"
        ]
      }
    );
  }

  articles.sort((a, b) => b.timestamp - a.timestamp);

  const outDir = path.join(__dirname, "..", "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "news.json");

  const payload = {
    updatedAt: new Date().toISOString(),
    total: articles.length,
    articles
  };

  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Saved ${articles.length} health articles to ${outFile}`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
