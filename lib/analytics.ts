type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
  }
}

export function trackEvent({ action, category, label, value }: GTagEvent) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

export function trackToolUsage(toolName: string, action: string) {
  trackEvent({
    action,
    category: "ferramenta",
    label: toolName,
  });
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-YGVYMEH4Q9", {
      page_path: url,
    });
  }
}
