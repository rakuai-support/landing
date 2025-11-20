// シンプルなランディングページ用JavaScript



document.addEventListener('DOMContentLoaded', function() {
    // ハンバーガーメニューの機能
    console.log('Initializing hamburger menu functionality...');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    console.log('hamburgerMenu element:', hamburgerMenu);
    console.log('mainNav element:', mainNav);

    if (hamburgerMenu && mainNav) {
        console.log('Hamburger menu and main nav elements found. Adding event listener.');
        hamburgerMenu.addEventListener('click', function() {
            console.log('Hamburger menu clicked!');
            body.classList.toggle('nav-open');
            mainNav.classList.toggle('nav-open');
            this.classList.toggle('active'); // ハンバーガーアイコンのアニメーション用
            console.log('body has nav-open:', body.classList.contains('nav-open'));
            console.log('mainNav has nav-open:', mainNav.classList.contains('nav-open'));
            console.log('hamburgerMenu has active:', this.classList.contains('active'));
        });
    } else {
        console.log('Hamburger menu or main nav element not found. Skipping event listener setup.');
    }


    // ヘッダーの高さに応じてbodyのpadding-topを調整
    function adjustBodyPadding() {
        const header = document.querySelector('.header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight}px`;
        }
    }

    // ページの読み込み時とリサイズ時に高さを調整
    adjustBodyPadding();
    window.addEventListener('resize', adjustBodyPadding);

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ヘッダーのスクロール効果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // CTAボタンのクリック追跡（将来のアナリティクス用）
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            console.log('CTA clicked:', this.textContent.trim());
            // 将来的にはGoogle Analyticsやその他のトラッキングを追加
        });
    });

    // フェードインアニメーション（スクロール時）
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // アニメーション対象要素を設定
    document.querySelectorAll('.feature-card, .pricing-card, .faq-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // FAQ の開閉機能
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // 他のFAQを閉じる
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // クリックしたFAQを開く（既に開いていた場合は閉じる）
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // SEO用：関連キーワードの内部リンク強化
    const seoKeywords = [
        { keyword: 'インバウンド対応', url: 'https://omotenashiqr.com' },
        { keyword: '多言語対応', url: 'https://omotenashiqr.com' },
        { keyword: 'おもてなし', url: 'https://omotenashiqr.com' },
        { keyword: 'QRコード生成', url: 'https://omotenashiqr.com' },
        { keyword: 'AI動画生成', url: 'https://omotenashiqr.com' }
    ];

    // パフォーマンス計測（Core Web Vitals対応）
    if ('web-vital' in window) {
        getCLS(console.log);
        getFID(console.log);
        getLCP(console.log);
    }


    // 多言語タブ切り替え機能
    function initMultilingualTabs() {
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetLang = this.getAttribute('data-lang');
                const targetType = this.getAttribute('data-target');
                
                // 同じtargetグループ内でのタブ切り替え
                const tabGroup = document.querySelectorAll(`[data-target="${targetType}"]`);
                
                // 全てのタブとコンテンツを非アクティブに
                tabGroup.forEach(element => {
                    element.classList.remove('active');
                });
                
                // 選択されたタブと対応するコンテンツをアクティブに
                document.querySelectorAll(`[data-lang="${targetLang}"][data-target="${targetType}"]`).forEach(element => {
                    element.classList.add('active');
                });
                
                // Google Analytics トラッキング
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'language_tab_switch', {
                        language: targetLang,
                        content_type: targetType,
                        event_category: 'engagement'
                    });
                }
                
                console.log(`Language switched to ${targetLang} for ${targetType}`);
            });
        });
    }
    
    // 多言語タブ機能を初期化
    initMultilingualTabs();
    
    // QRコード生成機能（実際の画像がない場合のみ）
    function generateQRCode(url, container) {
        // 既に画像が存在する場合はスキップ
        if (container.querySelector('img')) {
            return;
        }
        
        const qrDiv = container;
        
        // フォールバック: Google Chart APIを使用
        const qrImg = document.createElement('img');
        qrImg.src = `https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(url)}`;
        qrImg.alt = 'QR Code';
        qrImg.style.width = '100%';
        qrImg.style.height = '100%';
        qrDiv.appendChild(qrImg);
    }
    
    // QRコード初期化
    function initQRCodes() {
        document.querySelectorAll('.qr-code').forEach(qrContainer => {
            const url = qrContainer.getAttribute('data-url');
            if (url) {
                generateQRCode(url, qrContainer);
            }
        });
    }
    
    // 動画再生機能（動画プレビューとQRコード両方に対応）
    function initVideoPreview() {
        // 動画プレビューエリアのクリック
        document.querySelectorAll('.clickable-video').forEach(placeholder => {
            placeholder.addEventListener('click', function() {
                playVideo(this.closest('.video-player'));
            });
        });
        
        // QRコードエリアのクリック
        document.querySelectorAll('.clickable-qr').forEach(qrContainer => {
            qrContainer.addEventListener('click', function() {
                playVideo(this.closest('.video-player'));
            });
        });
    }
    
    // 動画再生の共通関数
    function playVideo(videoContainer) {
        const lang = videoContainer.getAttribute('data-lang');
        const target = videoContainer.getAttribute('data-target');
        const videoUrl = videoContainer.getAttribute('data-url');
        
        // 実際の動画URLを開く
        if (videoUrl) {
            window.open(videoUrl, '_blank');
            console.log(`Opening video URL: ${videoUrl}`);
            
            // Google Analytics トラッキング
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_play', {
                    language: lang,
                    content_type: target,
                    video_url: videoUrl,
                    event_category: 'engagement'
                });
            }
        } else {
            console.log(`Playing video: ${target} in ${lang}`);
            alert(`${target}の${lang}版動画を再生します（URLが設定されていません）`);
        }
    }
    
    // 動画プレビュー機能を初期化
    initVideoPreview();
    
    // QRコード機能を初期化
    initQRCodes();
    
    // 多言語バッジのアニメーション効果
    document.querySelectorAll('.multilingual-badge').forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 注目動画（露天風呂）のハイライト効果
    const featuredShowcase = document.querySelector('.multilingual-showcase.featured');
    if (featuredShowcase) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'pulse 2s ease-in-out 3';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(featuredShowcase);
    }

    console.log('OmotenashiQRMaker Landing Page loaded successfully with multilingual tabs and SEO optimization');
    
    
});



// 音声再生機能
class VoicePlayer {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentButton = null;
        this.init();
    }

    init() {
        // 音声再生ボタンのイベントリスナーを設定
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('voice-play-btn')) {
                e.preventDefault();
                
                // 再生中で同じボタンがクリックされた場合は停止
                if (this.isPlaying && this.currentButton === e.target) {
                    this.stopCurrentAudio();
                    return;
                }
                
                const voiceName = e.target.getAttribute('data-voice');
                this.playVoiceSample(voiceName, e.target);
            }
        });
    }

    async playVoiceSample(voiceName, button) {
        try {
            // 同じボタンが既に再生中の場合は何もしない
            if (this.isPlaying && this.currentButton === button) {
                return;
            }

            // 現在再生中の音声を停止
            if (this.currentAudio) {
                this.stopCurrentAudio();
            }

            // ボタンの状態を「読み込み中」に変更
            this.setButtonState(button, 'loading');

            // wavファイルのURLを生成
            const audioUrl = `data/${voiceName}.wav`;
            
            // HTML5 Audio APIを使用して実際のwavファイルを再生
            this.playWithAudioAPI(audioUrl, button);

        } catch (error) {
            console.error('音声再生エラー:', error);
            this.setButtonState(button, 'error');
        }
    }


    playWithAudioAPI(audioUrl, button) {
        const audio = new Audio(audioUrl);
        
        // 音声設定
        audio.volume = 0.8;

        // 先に currentAudio を設定
        this.currentAudio = audio;
        this.currentButton = button;

        // イベントリスナー
        audio.onloadstart = () => {
            this.setButtonState(button, 'loading');
        };

        audio.oncanplay = () => {
            if (this.currentAudio === audio) { // まだこの音声が現在の音声か確認
                this.setButtonState(button, 'playing');
                this.isPlaying = true;
                audio.play().catch(error => {
                    console.error('音声再生エラー:', error);
                    this.setButtonState(button, 'error');
                });
            }
        };

        audio.onended = () => {
            if (this.currentAudio === audio) { // まだこの音声が現在の音声か確認
                this.setButtonState(button, 'ready');
                this.currentButton = null;
                this.isPlaying = false;
                this.currentAudio = null;
            }
        };

        audio.onerror = (error) => {
            console.error('音声ファイル読み込みエラー:', error);
            if (this.currentAudio === audio) { // まだこの音声が現在の音声か確認
                this.setButtonState(button, 'error');
                this.currentButton = null;
                this.isPlaying = false;
                this.currentAudio = null;
            }
        };

        audio.onpause = () => {
            if (this.currentAudio === audio) { // まだこの音声が現在の音声か確認
                this.setButtonState(button, 'ready');
                this.currentButton = null;
                this.isPlaying = false;
                this.currentAudio = null;
            }
        };

        // 音声ファイルの読み込み開始
        audio.load();
    }


    setButtonState(button, state) {
        const states = {
            'ready': {
                html: '▶️ 聴く',
                className: '',
                disabled: false
            },
            'loading': {
                html: '⏳ 読み込み中...',
                className: 'loading',
                disabled: true
            },
            'playing': {
                html: '⏹️ 停止',
                className: 'playing',
                disabled: false
            },
            'error': {
                html: '❌ エラー',
                className: 'error',
                disabled: true
            }
        };

        const stateConfig = states[state];
        if (stateConfig) {
            button.innerHTML = stateConfig.html;
            button.className = `voice-play-btn ${stateConfig.className}`;
            button.disabled = stateConfig.disabled;

            if (state === 'error') {
                setTimeout(() => {
                    this.setButtonState(button, 'ready');
                }, 3000);
            }
        }
    }

    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        
        if (this.currentButton) {
            this.setButtonState(this.currentButton, 'ready');
            this.currentButton = null;
        }
        
        this.isPlaying = false;
        this.currentAudio = null;
    }

    showUnsupportedMessage(button) {
        button.innerHTML = '🚫 未対応';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '▶️ 聴く';
            button.disabled = false;
        }, 3000);

        // ユーザーに通知
        if (confirm('申し訳ございませんが、お使いのブラウザでは音声再生機能がサポートされていません。実際の音声品質は、アプリケーションでご確認ください。アプリを開きますか？')) {
            window.open('https://omotenashiqr.com', '_blank');
        }
    }
}

// VoicePlayerのインスタンスを初期化
document.addEventListener('DOMContentLoaded', () => {
    new VoicePlayer();
});



// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // ... 既存のコード ...

    // ページがexamples.htmlの場合のみ実行
    if (window.location.pathname.endsWith('examples.html')) {
        // 既存のExamplesPageクラスのインスタンス化はそのまま
    }

    // ページがblog.htmlの場合、フィルター機能を初期化
    if (window.location.pathname.endsWith('blog.html')) {
        initBlogFilter();
    }
});

// Blogフィルター機能
function initBlogFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const blogCards = document.querySelectorAll('.blog-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // アクティブクラスを切り替え
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // カードのフィルタリング
            blogCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}