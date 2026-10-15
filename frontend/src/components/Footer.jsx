import { FaWhatsapp, FaInstagram, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

// EDIT THESE with the boutique's real details. Leave a field as "" to hide it.
const CONTACT = {
  name: "Sri Laxmi Boutiques",
  tagline: "Hand-picked dresses and separates.",
  contactName: "N. Akhila Reddy",
  phone: "+91 84979 07007",
  whatsapp: "918497907007", // country code + number, digits only
  email: "nallapuramakhilareddy@gmail.com",
  address: "Rythu Colony, Shadnagar, Ranga Reddy District, Telangana - 509216",
  hours: "Mon - Sat, 10:00 AM - 8:00 PM",
  instagram: "", // e.g. https://instagram.com/yourpage
};

export default function Footer() {
  const c = CONTACT;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-name">{c.name}</span>
          {c.tagline && <p>{c.tagline}</p>}
        </div>

        <div className="footer-col">
          <h4>Contact us</h4>
          {c.contactName && <p className="footer-contact-name">{c.contactName}</p>}
          {c.phone && (
            <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="footer-link">
              <FaPhoneAlt className="footer-icon" /> {c.phone}
            </a>
          )}
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer" className="footer-link">
              <FaWhatsapp className="footer-icon footer-icon-wa" /> WhatsApp us
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="footer-link">
              <FaEnvelope className="footer-icon" /> {c.email}
            </a>
          )}
          {c.instagram && (
            <a href={c.instagram} target="_blank" rel="noreferrer" className="footer-link">
              <FaInstagram className="footer-icon footer-icon-ig" /> Instagram
            </a>
          )}
        </div>

        {(c.address || c.hours) && (
          <div className="footer-col">
            <h4>Visit the store</h4>
            {c.address && <p>{c.address}</p>}
            {c.hours && <p>{c.hours}</p>}
          </div>
        )}
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} {c.name}. All rights reserved.
      </div>
    </footer>
  );
}
