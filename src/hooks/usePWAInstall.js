import { useState, useEffect } from 'react'

/**
 * usePWAInstall
 * Returns:
 *   canInstall  — true when the browser's beforeinstallprompt fired
 *   isInstalled — true when app is running in standalone (already installed)
 *   isIOS       — true on Safari/iOS (no beforeinstallprompt, manual install)
 *   install()   — call to trigger native install dialog
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [justInstalled, setJustInstalled] = useState(false)

  // Detect iOS
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !window.navigator.userAgent.includes('Chrome') &&
    !window.navigator.userAgent.includes('CriOS')

  // Detect standalone mode (already installed)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')

  useEffect(() => {
    setIsInstalled(isStandalone)

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Track successful install
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null)
      setCanInstall(false)
      setIsInstalled(true)
      setJustInstalled(true)
      setTimeout(() => setJustInstalled(false), 5000)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setCanInstall(false)
    return outcome === 'accepted'
  }

  return { canInstall, isInstalled, isIOS, isStandalone, justInstalled, install }
}
