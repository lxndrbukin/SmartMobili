import { type JSX, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch, submitInquiry } from "../../store";

export default function ContactForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const telegram = formData.get("telegram") === "on";
    const viber = formData.get("viber") === "on";
    const whatsapp = formData.get("whatsapp") === "on";
    const data = {
      name,
      subject,
      description,
      phone,
      email,
      item_id: undefined,
      telegram,
      viber,
      whatsapp,
    };
    dispatch(submitInquiry(data));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>Contact Us</h3>
      <div className="input-field">
        <label>Name</label>
        <input placeholder="e.g. John or John Doe" type="text" name="name" />
      </div>
      <div className="input-field">
        <label>Subject</label>
        <input
          placeholder="e.g. Wardrobe for bedroom"
          type="text"
          name="subject"
        />
      </div>
      <div className="input-field">
        <label>Description</label>
        <textarea name="description" />
      </div>
      <div className="input-field">
        <label>Phone Number</label>
        <input type="text" name="phone" />
      </div>
      <div className="input-field">
        <label>Communication</label>
        <div className="communication">
          <label htmlFor="telegram">Telegram</label>
          <input type="checkbox" name="telegram" />
        </div>
        <div className="communication">
          <label htmlFor="viber">Viber</label>
          <input type="checkbox" name="viber" />
        </div>
        <div className="communication">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input type="checkbox" name="whatsapp" />
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
