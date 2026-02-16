const video = document.getElementById('mirror');
const messageElement = document.getElementById('message');
const errorElement = document.getElementById('error');
const errorText = document.getElementById('error-text');
const controls = document.getElementById('controls');
const brightnessSlider = document.getElementById('brightness');
const brightnessValue = document.getElementById('brightness-value');
const zoomSlider = document.getElementById('zoom');
const zoomValue = document.getElementById('zoom-value');
const pauseBtn = document.getElementById('pause-btn');

let stream = null;
let isPaused = false;
let hideControlsTimeout = null;

// 設定を読み込む
function loadSettings() {
    const saved = localStorage.getItem('kagami-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            if (settings.brightness) {
                brightnessSlider.value = settings.brightness;
            }
            if (settings.zoom) {
                zoomSlider.value = settings.zoom;
            }
        } catch (e) {
            console.error('設定の読み込みエラー:', e);
        }
    }
}

// 設定を保存する
function saveSettings() {
    const settings = {
        brightness: brightnessSlider.value,
        zoom: zoomSlider.value
    };
    localStorage.setItem('kagami-settings', JSON.stringify(settings));
}

// カメラを起動
async function startCamera() {
    try {
        // カメラへのアクセスをリクエスト（Full HD固定）
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: 'user' // フロントカメラを優先
            },
            audio: false
        });

        // ビデオ要素にストリームを設定
        video.srcObject = stream;
        
        // メッセージを非表示、コントロールを表示
        messageElement.classList.add('hidden');
        controls.classList.remove('hidden');
        
        // フィルターを適用
        applyFilters();
        
    } catch (error) {
        console.error('カメラアクセスエラー:', error);
        
        // エラーメッセージを表示
        messageElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        
        // エラーの種類に応じたメッセージ
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorText.textContent = 'カメラへのアクセスが拒否されました。\nブラウザの設定からカメラの使用を許可してください。';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorText.textContent = 'カメラが見つかりません。\nカメラが接続されているか確認してください。';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorText.textContent = 'カメラにアクセスできません。\n他のアプリケーションで使用されている可能性があります。';
        } else {
            errorText.textContent = 'カメラの起動に失敗しました。\nページを再読み込みしてください。';
        }
    }
}

// クリーンアップ処理
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// 明るさを更新
function updateBrightness() {
    const value = brightnessSlider.value;
    brightnessValue.textContent = value + '%';
    applyFilters();
    saveSettings();
}

// ズームを更新
function updateZoom() {
    const value = zoomSlider.value;
    const zoomLevel = value / 100;
    zoomValue.textContent = zoomLevel.toFixed(1) + 'x';
    applyFilters();
    saveSettings();
}

// フィルターとトランスフォームを適用
function applyFilters() {
    const brightness = brightnessSlider.value / 100;
    const zoom = zoomSlider.value / 100;
    video.style.filter = `brightness(${brightness})`;
    video.style.transform = `scaleX(-1) scale(${zoom})`;
}

// 一時停止/再開
function togglePause() {
    if (isPaused) {
        video.play();
        pauseBtn.textContent = '⏸ 一時停止';
        isPaused = false;
    } else {
        video.pause();
        pauseBtn.textContent = '▶ 再開';
        isPaused = true;
    }
}

// コントロールパネルの表示/非表示
function showControls() {
    controls.classList.remove('hidden');
    
    // 既存のタイマーをクリア
    if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
    }
    
    // 3秒後に自動的に非表示
    hideControlsTimeout = setTimeout(() => {
        controls.classList.add('hidden');
    }, 3000);
}

// イベントリスナーの設定
brightnessSlider.addEventListener('input', updateBrightness);
zoomSlider.addEventListener('input', updateZoom);
pauseBtn.addEventListener('click', togglePause);

// マウス移動時にコントロールを表示
document.addEventListener('mousemove', showControls);

// コントロールパネル上ではタイマーをクリア
controls.addEventListener('mouseenter', () => {
    if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
    }
});

controls.addEventListener('mouseleave', () => {
    hideControlsTimeout = setTimeout(() => {
        controls.classList.add('hidden');
    }, 3000);
});

// ページ読み込み時に設定を読み込んでカメラを起動
window.addEventListener('load', () => {
    loadSettings();
    startCamera();
});

// ページを離れる時にカメラを停止
window.addEventListener('beforeunload', stopCamera);

// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
