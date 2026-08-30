// RIS School App — Native Bridge (Capacitor 6 Hardware & OS Integration)
// Seamlessly operates in both Web Browsers and Native Android / iOS Containers.

class NativeBridge {
  constructor() {
    this.isNative = false;
    this.plugins = {};
    this.hasNotificationPermission = false;
  }

  async init(appInstance) {
    this.app = appInstance;
    this.isNative = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform();

    console.log([NativeBridge] Initializing... Native Platform: );

    if (this.isNative) {
      await this.initNativePlugins();
      this.setupHardwareBackButton();
      this.setupStatusBar();
      await this.requestNotificationPermissions();
    } else {
      this.setupWebNotificationFallback();
    }

    this.setupNetworkMonitor();
  }

  async initNativePlugins() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins) {
        this.plugins = window.Capacitor.Plugins;
        console.log([NativeBridge] Native plugins loaded:, Object.keys(this.plugins));
      }
    } catch (e) {
      console.warn([NativeBridge] Plugin loading exception:, e);
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
      console.warn([NativeBridge] StatusBar setup issue:, e);
    }
  }

  setupHardwareBackButton() {
    try {
      const { App } = this.plugins;
      if (App) {
        App.addListener('backButton', ({ canGoBack }) => {
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
      console.warn([NativeBridge] Back button listener issue:, e);
    }
  }

  async requestNotificationPermissions() {
    try {
      const { LocalNotifications } = this.plugins;
      if (LocalNotifications) {
        const status = await LocalNotifications.requestPermissions();
        this.hasNotificationPermission = status.display === 'granted';
        console.log([NativeBridge] Notification permission status:, status.display);
      }
    } catch (e) {
      console.warn([NativeBridge] Notification permission request issue:, e);
    }
  }

  setupWebNotificationFallback() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Prompt user on first relevant action
      this.hasNotificationPermission = Notification.permission === 'granted';
    }
  }

  async sendNativeNotification({ title, body, id = Date.now(), extra = {} }) {
    try {
      if (this.isNative && this.plugins.LocalNotifications) {
        await this.plugins.LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Math.random() * 1000000),
              title: title || RIS School Notification,
              body: body || ",
 schedule: { at: new Date(Date.now() + 100) },
 sound: 'beep.wav',
 attachments: undefined,
 actionTypeId: ,
 extra: extra
 }
 ]
 });
 return true;
 }

 // Browser Web Notification fallback
 if ('Notification' in window && Notification.permission === 'granted') {
 new Notification(title, {
 body,
 icon: './assets/icon.png',
 badge: './assets/icon.png'
 });
 return true;
 }
 } catch (e) {
 console.warn([NativeBridge] Notification dispatch exception:, e);
 }
 return false;
 }

 async triggerHaptic(type = 'light') {
 try {
 if (this.isNative && this.plugins.Haptics) {
 const { Haptics, ImpactStyle } = this.plugins;
 const style = type === 'medium' ? 'MEDIUM' : (type === 'heavy' ? 'HEAVY' : 'LIGHT');
 await Haptics.impact({ style });
 } else if (navigator && navigator.vibrate) {
 navigator.vibrate(type === 'medium' ? 30 : 15);
 }
 } catch (e) {
 // Haptics unsupported or silent fail
 }
 }

 setupNetworkMonitor() {
 const handleReconnection = async () => {
 console.log([NativeBridge] Network reconnected! Syncing database...);
 if (this.app && window.store && window.db) {
 await window.store.syncNoticesOnce(window.db);
 await window.store.syncWithCloud(window.db);
 if (this.app.showToast) {
 this.app.showToast(⚡ Back online: Database synced!, success);
 }
 }
 };

 window.addEventListener('online', handleReconnection);
 window.addEventListener('offline', () => {
 if (this.app && this.app.showToast) {
 this.app.showToast(📡 Offline mode active: Changes will sync when reconnected., warning);
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
 console.warn([NativeBridge] Native network listener error:, e);
 }
 }
}

export const nativeBridge = new NativeBridge();
