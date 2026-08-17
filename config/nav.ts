export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Finance",
    items: [
      {
        id: "binance-btc",
        label: "Binance BTC",
        icon: "💎",
        href: "/sources/crypto",
        description: "Real-time Bitcoin price from Binance",
        badge: "LIVE",
        badgeVariant: "destructive",
      },
    ],
  },
  {
    label: "Aviation",
    items: [
      {
        id: "opensky-limited",
        label: "OpenSky Network",
        icon: "✈️",
        href: "/sources/aviation",
        description: "Live aircraft tracking worldwide",
      },
    ],
  },
  {
    label: "Weather",
    items: [
      {
        id: "open-meteo",
        label: "Open Meteo",
        icon: "🌡️",
        href: "/sources/weather",
        description: "Current weather conditions",
      },
    ],
  },
  {
    label: "Science",
    items: [
      {
        id: "earthquakes",
        label: "Earthquakes",
        icon: "🌋",
        href: "/sources/earthquakes",
        description: "Real-time global seismic activity",
        badge: "NEW",
        badgeVariant: "default",
      },
    ],
  },
  {
    label: "Fun",
    items: [
      {
        id: "kanye-quotes",
        label: "Kanye Quotes",
        icon: "🎤",
        href: "/sources/kanye",
        description: "Wisdom straight from Ye",
      },
      {
        id: "corporate-bs",
        label: "Corporate BS",
        icon: "💼",
        href: "/sources/corporate",
        description: "Buzzword generator for meetings",
      },
      {
        id: "bored-api",
        label: "Bored API",
        icon: "🎲",
        href: "/sources/bored",
        description: "Random activity suggestions",
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
