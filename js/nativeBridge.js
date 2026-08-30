// RIS School App — Native Bridge (Capacitor 6 Hardware & OS Integration)
// Seamlessly operates in both Web Browsers and Native Android / iOS Containers.

class NativeBridge {
  constructor() {
    this.isNative = false;
    this.plugins = {};
    this.hasNotificationPermission = false;
    this._channelCreated = false;
  }

  async init(appInstance) {
    this.app = appInstance;
    this.isNative = typeof window !== 'undefined' && !!window.Capacitor && window.Capacitor.isNativePlatform();

    console.log('[NativeBridge] Initializing... Native Platform:', this.isNative);

    if (this.isNative) {
      await this.initNativePlugins();
      this.setupHardwareBackButton();
      this.setupStatusBar();
      await this.setupNotifications();
    } else {
      this.setupWebNotificationFallback();
    }

    this.setupNetworkMonitor();
  }

  async initNativePlugins() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins) {
        this.plugins = window.Capacitor.Plugins;
        console.log('[NativeBridge] Native plugins loaded:', Object.keys(this.plugins));
      }
    } catch (e) {
      console.warn('[NativeBridge] Plugin loading exception:', e);
    }
  }

  async setupStatusBar() {
    try {
      const { StatusBar } = this.plugins;
      if (StatusBar) {
        await StatusBar.setBackgroundColor({ color: '#0f172a' });
        await StatusBar.setStyle({ style: 'DARK' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      }
    } catch (e) {
      console.warn('[NativeBridge] StatusBar setup issue:', e);
    }
  }

  setupHardwareBackButton() {
    try {
      const { App } = this.plugins;
      if (App) {
        App.addListener('backButton', () => {
          // 1. Close open modals first
          const openModals = document.querySelectorAll('.fixed.inset-0:not(.hidden), #audit-log-drawer:not(.hidden)');
          if (openModals && openModals.length > 0) {
            openModals.forEach(m => m.classList.add('hidden'));
            return;
          }

          // 2. Navigate to dashboard if on sub-page
          if (this.app && this.app.currentPage && this.app.currentPage !== 'dashboard' && this.app.currentPage !== 'login') {
            window.router.navigate('dashboard');
            return;
          }

          // 3. If on dashboard / login, exit app
          App.exitApp();
        });
      }
    } catch (e) {
      console.warn('[NativeBridge] Back button listener issue:', e);
    }
  }

  async setupNotifications() {
    try {
      const { LocalNotifications } = this.plugins;
      if (!LocalNotifications) return;

      // 1. Request permission FIRST (required on Android 13+ / iOS)
      const status = await LocalNotifications.requestPermissions();
      this.hasNotificationPermission = status.display === 'granted';
      console.log('[NativeBridge] Notification permission:', status.display);

      if (!this.hasNotificationPermission) {
        console.warn('[NativeBridge] Notification permission denied — notifications will not appear');
        return;
      }

      // 2. Create high-importance notification channel (required on Android 8.0+)
      // Must be created AFTER permission is granted
      await LocalNotifications.createChannel({
        id: 'ris_school_notices',
        name: 'School Notices',
        description: 'Notices and announcements from Rose International School',
        importance: 5,    // IMPORTANCE_HIGH — shows heads-up, plays sound, vibrates
        visibility: 1,    // VISIBILITY_PUBLIC — shows on lockscreen
        vibration: true,
        lights: true,
        lightColor: '#2563EB',
        sound: null       // null = use default system notification sound
      });

      this._channelCreated = true;
      console.log('[NativeBridge] Notification channel created successfully');

    } catch (e) {
      console.warn('[NativeBridge] Notification setup error:', e);
    }
  }

  setupWebNotificationFallback() {
    if ('Notification' in window) {
      this.hasNotificationPermission = Notification.permission === 'granted';
    }
  }

  async sendNativeNotification({ title, body }) {
    try {
      // --- Native Android path ---
      if (this.isNative && this.plugins.LocalNotifications && this._channelCreated) {
        const notifId = Math.floor(Math.random() * 2147483647); // must fit int32
        await this.plugins.LocalNotifications.schedule({
          notifications: [{
            id: notifId,
            title: title || 'RIS School',
            body: body || '',
            channelId: 'ris_school_notices',
            schedule: { at: new Date(Date.now() + 300) }, // 300ms from now
            ongoing: false,
            autoCancel: true
          }]
        });
        console.log('[NativeBridge] Native notification scheduled, id:', notifId);
        return true;
      }

      // --- Browser fallback ---
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title || 'RIS School', {
          body: body || '',
          icon: './assets/icon.png'
        });
        return true;
      }

    } catch (e) {
      console.warn('[NativeBridge] Notification send error:', e);
    }
    return false;
  }

  async triggerHaptic(type = 'light') {
    try {
      if (this.isNative && this.plugins.Haptics) {
        const style = type === 'medium' ? 'MEDIUM' : (type === 'heavy' ? 'HEAVY' : 'LIGHT');
        await this.plugins.Haptics.impact({ style });
      } else if (navigator && navigator.vibrate) {
        navigator.vibrate(type === 'medium' ? 30 : 15);
      }
    } catch (e) {
      // Silent fail if haptics unsupported
    }
  }

  setupNetworkMonitor() {
    const handleReconnection = async () => {
      console.log('[NativeBridge] Network reconnected! Syncing database...');
      if (this.app && window.store && window.db) {
        await window.store.syncNoticesOnce(window.db);
        await window.store.syncWithCloud(window.db);
        if (this.app.showToast) {
          this.app.showToast('⚡ Back online: Database synced!', 'success');
        }
      }
    };

    window.addEventListener('online', handleReconnection);
    window.addEventListener('offline', () => {
      if (this.app && this.app.showToast) {
        this.app.showToast('📡 Offline mode active: Changes will sync when reconnected.', 'warning');
      }
    });

    try {
      if (this.isNative && this.plugins.Network) {
        this.plugins.Network.addListener('networkStatusChange', status => {
          if (status.connected) {
            handleReconnection();
          }
        });
      }
    } catch (e) {
      console.warn('[NativeBridge] Native network listener error:', e);
    }
  }
}

export const nativeBridge = new NativeBridge();
