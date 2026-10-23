"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { HealthMarqueeTicker } from "@/components/HealthMarqueeTicker";
import { CategoryNav } from "@/components/CategoryNav";
import { HeroFeatured } from "@/components/HeroFeatured";
import { HealthCard } from "@/components/HealthCard";
import { ArticleModal } from "@/components/ArticleModal";
import { DailyBriefingModal } from "@/components/DailyBriefingModal";
import { BookmarksDrawer } from "@/components/BookmarksDrawer";
import { FeedManagerModal } from "@/components/FeedManagerModal";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSpeech } from "@/hooks/useSpeech";
import { NewsArticle, Category, FeedSource } from "@/lib/types";
import { getAutoRefreshInterval } from "@/lib/storage";
import {
  Leaf,
  Sparkles,
  Award,
  BookOpen,
  HeartPulse
} from "lucide-react";

const CATEGORIES_KO: Category[] = [
  "전체 건강 & 웰빙",
  "장수 & 안티에이징 의학",
  "영양 & 기능성 식품 과학",
  "수면 & 뇌신경 웰니스",
  "심혈관 & 대사 건강",
  "면역 & 마이크로바이옴",
  "운동 처방 & 재활 치료"
];

export default function KoreanHealthHomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체 건강 & 웰빙");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "readTime">("latest");
  const [nextSyncSeconds, setNextSyncSeconds] = useState(60);

  // Modals & Drawers
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isFeedsOpen, setIsFeedsOpen] = useState(false);
  const [feeds, setFeeds] = useState<FeedSource[]>([]);

  // Hooks
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const {
    isPlaying: isPlayingAudio,
    isPaused: isPausedAudio,
    speak: onSpeak,
    pause: onPauseAudio,
    resume: onResumeAudio,
    stop: onStopAudio,
  } = useSpeech();

  const fetchArticles = useCallback(async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "전체 건강 & 웰빙") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("sortBy", sortBy);
      params.append("lang", "ko");

      let data: any = null;
      try {
        const res = await fetch(`/api/news?${params.toString()}`);
        if (res.ok) {
          data = await res.json();
        }
      } catch (e) {
        // Fallback for static hosting
      }

      if (!data || !data.articles || data.articles.length === 0) {
        const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/health-wellness-news-hub") ? "/health-wellness-news-hub" : "";
        const fallbackRes = await fetch(`${basePath}/data/news.json`).catch(() => null);
        if (fallbackRes && fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          let filtered = fallbackData.articles || [];
          if (selectedCategory !== "전체 건강 & 웰빙") {
            filtered = filtered.filter((a: any) => a.category === selectedCategory);
          }
          if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            filtered = filtered.filter((a: any) =>
              a.title?.toLowerCase().includes(q) ||
              a.snippet?.toLowerCase().includes(q)
            );
          }
          if (sortBy === "popular") {
            filtered = [...filtered].sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0));
          } else if (sortBy === "readTime") {
            filtered = [...filtered].sort((a: any, b: any) => (a.readTime || 1) - (b.readTime || 1));
          } else {
            filtered = [...filtered].sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          }
          data = { articles: filtered };
        }
      }

      if (data && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Fetch health articles error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery, sortBy]);

  const loadFeeds = useCallback(async () => {
    try {
      const res = await fetch("/api/feeds");
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchArticles();
    loadFeeds();
  }, [fetchArticles, loadFeeds]);

  // Auto-refresh timer
  useEffect(() => {
    const intervalMinutes = getAutoRefreshInterval() || 15;
    const intervalSeconds = intervalMinutes * 60;
    setNextSyncSeconds(intervalSeconds);

    const timer = setInterval(() => {
      setNextSyncSeconds((prev) => {
        if (prev <= 1) {
          fetchArticles();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchArticles]);

  const handleToggleFeed = async (feedId: string) => {
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", feedId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        fetchArticles();
      }
    } catch (err) {}
  };

  const handleAddCustomFeed = async (feed: Partial<FeedSource>) => {
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", feed }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        fetchArticles();
      }
    } catch (err) {}
  };

  const handleResetFeeds = async () => {
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        fetchArticles();
      }
    } catch (err) {}
  };

  // Category counts
  const categoryCounts = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    acc["전체 건강 & 웰빙"] = (acc["전체 건강 & 웰빙"] || 0) + 1;
    return acc;
  }, {} as { [cat: string]: number });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <div>
        {/* Real-time Clinical Discovery Ticker */}
        <HealthMarqueeTicker locale="ko" />

        {/* Command Header with Healing Sound Player */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={fetchArticles}
          isRefreshing={refreshing}
          nextSyncSeconds={nextSyncSeconds}
          locale="ko"
          bookmarkCount={bookmarks.length}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          onOpenBriefing={() => setIsBriefingOpen(true)}
          onOpenFeeds={() => setIsFeedsOpen(true)}
        />

        {/* Category Pill Navbar */}
        <CategoryNav
          categories={CATEGORIES_KO}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          
          {/* Hero Featured Lead Study */}
          {selectedCategory === "전체 건강 & 웰빙" && !searchQuery.trim() && articles.length > 0 && (
            <HeroFeatured
              articles={articles}
              locale="ko"
              onSelectArticle={setSelectedArticle}
            />
          )}

          {/* Section Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 pt-4 border-t border-sage-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sage-100 dark:bg-sage-950/50 text-sage-700 dark:text-sage-400">
                <Leaf className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {selectedCategory} 최신 피어리뷰 논문 브리핑
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sage-50 text-sage-800 dark:bg-sage-950/60 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
                {articles.length}편
              </span>
            </div>

            {/* Sort Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-sage-50/80 dark:bg-slate-900 border border-sage-200/80 dark:border-slate-800 self-start sm:self-auto text-xs font-bold">
              <button
                onClick={() => setSortBy("latest")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  sortBy === "latest"
                    ? "bg-white dark:bg-slate-800 text-sage-800 dark:text-sage-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                최신 논문순
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  sortBy === "popular"
                    ? "bg-white dark:bg-slate-800 text-sage-800 dark:text-sage-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                🌿 임상 추천순
              </button>
              <button
                onClick={() => setSortBy("readTime")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  sortBy === "readTime"
                    ? "bg-white dark:bg-slate-800 text-sage-800 dark:text-sage-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                핵심 숏컷순
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-sage-200 dark:border-slate-800 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-sage-100 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-6 bg-sage-100 dark:bg-slate-800 rounded w-full" />
                  <div className="h-16 bg-sage-100 dark:bg-slate-800 rounded" />
                  <div className="h-8 bg-sage-100 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-sage-200 dark:border-slate-800">
              <Sparkles className="w-10 h-10 mx-auto text-sage-400 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                검색된 의학 논문이 없습니다
              </h3>
              <p className="text-xs text-slate-400">
                다른 검색어를 입력하시거나 카테고리를 변경해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((art) => (
                <HealthCard
                  key={art.id}
                  article={art}
                  isBookmarked={isBookmarked(art.id)}
                  locale="ko"
                  onToggleBookmark={toggleBookmark}
                  onOpenReader={setSelectedArticle}
                  onPlayAudio={onSpeak}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-sage-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-sage-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">비타펄스 (VitaPulse)</span>
            <span>• 피어리뷰 임상 논문 기반 건강, 장수의학 & 마인드 웰니스 허브</span>
          </div>
          <p>© 2026 VitaPulse. Dedicated to Evidence-Based Health & Scientific Longevity.</p>
        </div>
      </footer>

      {/* Modals */}
      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? isBookmarked(selectedArticle.id) : false}
        locale="ko"
        onToggleBookmark={toggleBookmark}
        isPlayingAudio={isPlayingAudio}
        isPausedAudio={isPausedAudio}
        onSpeak={onSpeak}
        onPauseAudio={onPauseAudio}
        onResumeAudio={onResumeAudio}
        onStopAudio={onStopAudio}
      />

      <DailyBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        articles={articles}
        locale="ko"
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        locale="ko"
        onSelectArticle={setSelectedArticle}
        onRemoveBookmark={toggleBookmark}
      />

      <FeedManagerModal
        isOpen={isFeedsOpen}
        onClose={() => setIsFeedsOpen(false)}
        feeds={feeds}
        locale="ko"
        onToggleFeed={handleToggleFeed}
        onAddCustomFeed={handleAddCustomFeed}
        onResetFeeds={handleResetFeeds}
      />

    </div>
  );
}
