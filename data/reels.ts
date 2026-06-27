export const reels = [
  { id: "DZS1RYsRTpR", url: "https://www.instagram.com/reel/DZS1RYsRTpR/" },
  { id: "DYGbJoXxGNc", url: "https://www.instagram.com/reel/DYGbJoXxGNc/" },
  { id: "DWmzBt7kYmB", url: "https://www.instagram.com/reel/DWmzBt7kYmB/" },
  { id: "DV11xinkUAz", url: "https://www.instagram.com/reel/DV11xinkUAz/" },
  { id: "DWo-7AOkRK1", url: "https://www.instagram.com/reel/DWo-7AOkRK1/" },
  { id: "DV8zAtmEZgE", url: "https://www.instagram.com/reel/DV8zAtmEZgE/" },
  { id: "DZ3KWq2RD40", url: "https://www.instagram.com/reel/DZ3KWq2RD40/" },
];

export function getReelIframe(id: string) {
  return `<iframe src="https://www.instagram.com/reel/${id}/embed/" width="340" height="580" frameborder="0" scrolling="no" allowtransparency="true" style="border-radius:12px;border:1px solid rgba(255,255,255,0.1);"></iframe>`;
}
