export default function Footer() {
  return (
    <footer className="bg-green-deep text-cloud text-[13px] py-12">
      <div className="max-w-[1080px] mx-auto px-8">
        <div className="flex justify-between flex-wrap gap-6 mb-7">
          <div>
            <div className="font-display text-lg text-parchment">Shauri Moyo SDA Church</div>
            <p className="mt-2 max-w-[280px] text-cloud">A congregation gathering every Sabbath to worship, learn, and serve.</p>
          </div>
          <div>
            <p className="text-parchment font-medium mb-2">Visit us</p>
            <p>Shauri Moyo, Nairobi<br />Sabbath school 9:00 AM &middot; Divine service 10:45 AM</p>
          </div>
          <div>
            <p className="text-parchment font-medium mb-2">Contact</p>
            <p>hello@shaurimoyosda.org<br />+254 7XX XXX XXX</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between flex-wrap gap-2">
          <span>&copy; 2026 Shauri Moyo SDA Church</span>
          <span>Powered by Kanisa</span>
        </div>
      </div>
    </footer>
  );
}
