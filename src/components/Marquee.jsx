export default function Marquee({ items = [] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-group" key={group}>
            {items.map((item, index) => (
              <span className="marquee-item" key={`${group}-${index}`}>
                {item}
                <span className="marquee-arrow">↗</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
