/*
 * STORM SHIELD DESIGN — Reviews Section
 * Real Google reviews with 5-star display
 */
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Jordan Martin",
    stars: 5,
    text: "I went with Jesse at Restore America — he was very responsive, thorough and knowledgeable. Made the whole insurance process so much easier than I expected.",
    location: "Georgia",
    service: "Storm Damage",
  },
  {
    name: "Hunter Martinez",
    stars: 5,
    text: "Jesse and the team at Restore America have been very helpful and took care of our issue in a timely manner. Have recommended him to several family members.",
    location: "Georgia",
    service: "Roof Replacement",
  },
  {
    name: "Ginger Astle",
    stars: 5,
    text: "I can't say enough about Jesse and Lexi from Restore America! Their dedication to their work is inspiring. They communicate, stay organized, and deliver quality every time.",
    location: "Georgia",
    service: "Full Restoration",
  },
  {
    name: "Regina Johnson",
    stars: 5,
    text: "Jesse with Restore America was totally professional in his quick and reliable responses to my roof repair after a hail storm. Handled everything perfectly.",
    location: "Georgia",
    service: "Hail Damage",
  },
  {
    name: "Dawn Brown",
    stars: 5,
    text: "Working in property management for many years, I was extremely pleased to work with Brandon, Sandy and Ryan. Very professional, detailed and reasonably priced!",
    location: "Georgia",
    service: "Commercial Roofing",
  },
  {
    name: "Pam Jones Clay",
    stars: 5,
    text: "They were great! Bob & BJ inspected my storm-damaged roof and handled everything with the adjusters. Made the whole process easy. Highly recommend!",
    location: "Georgia",
    service: "Insurance Claim",
  },
  {
    name: "Amanda Ferguson",
    stars: 5,
    text: "BJ and his team were great! Explained everything clearly and worked around my busy schedule. I will continue to use them for all my roofing needs.",
    location: "Georgia",
    service: "Roof Repair",
  },
  {
    name: "Martha Lang",
    stars: 5,
    text: "Working with Kahler has been a joy. Helpful, efficient, and answered all my questions in a timely manner. The work quality is outstanding.",
    location: "Georgia",
    service: "Roof Replacement",
  },
  {
    name: "Garrett Brown",
    stars: 5,
    text: "Working with Restore America was a great experience — the team was friendly, reliable, and made me feel taken care of throughout the entire process.",
    location: "Georgia",
    service: "Storm Restoration",
  },
];

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20" style={{ backgroundColor: "#F4F6F9" }}>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#CC2222", fontFamily: "Oswald, sans-serif" }}>What Our Clients Say</div>
            <h2
              style={{
                color: "#1B3A6B",
                fontFamily: "Oswald, sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 700,
              }}
            >
              TRUSTED BY HUNDREDS
              <br />
              OF GEORGIA FAMILIES
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-6 h-6 fill-[#FBBF24] text-[#FBBF24]" />
              ))}
            </div>
            <div
              className="font-bold text-2xl"
              style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif" }}
            >
              5.0 / 5.0
            </div>
            <div className="text-gray-500 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
              113 verified Google reviews
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow border-t-2"
              style={{ borderTopColor: i % 3 === 0 ? "#CC2222" : i % 3 === 1 ? "#1B3A6B" : "#1B3A6B" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="font-bold text-base"
                    style={{ color: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.03em" }}
                  >
                    {review.name}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: "Roboto, sans-serif" }}>
                    {review.location} · {review.service}
                  </div>
                </div>
                <Quote className="w-6 h-6 flex-shrink-0" style={{ color: "#CC2222" }} />
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(review.stars)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <p
                className="text-gray-600 text-sm leading-relaxed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Google review CTA */}
        <div className="text-center">
          <a
            href="https://www.google.com/search?client=safari&hs=IqsU&sca_esv=cd962c5e58ff07e4&hl=en-us&sxsrf=ANbL-n5--ems9IeoYd5aRPuQa-ysP_MLog:1773931312241&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQRCbq0lnHirWrFHWx-n30A95iyNt-An3A_nP8YBBJydIjXxgB__NPyw_CoNz8Sc3V3cXDjiP3Dwx2VGCU7zehYiyeL6&q=Restore+America+Reviews&sa=X&ved=2ahUKEwjO--KNmayTAxWjnSYFHVYJNswQ0bkNegQIJxAH&biw=1368&bih=899&dpr=2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 text-white px-6 py-3 font-bold tracking-wider uppercase transition-colors text-sm hover:opacity-90"
            style={{ borderColor: "#1B3A6B", backgroundColor: "#1B3A6B", fontFamily: "Oswald, sans-serif", letterSpacing: "0.1em" }}
          >
            VIEW ALL 113 GOOGLE REVIEWS
          </a>
        </div>
      </div>
    </section>
  );
}
