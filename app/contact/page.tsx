"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [formMessage, setFormMessage] = useState({ show: false, text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setFormMessage({ show: true, text: "Sending...", type: "info" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setFormMessage({ show: true, text: "✅ Message sent successfully!", type: "success" });
        form.reset();
        setTimeout(() => setFormMessage({ show: false, text: "", type: "" }), 5000);
      } else {
        setFormMessage({ show: true, text: "❌ Error sending message. Try again.", type: "error" });
      }
    } catch (error) {
      setFormMessage({ show: true, text: "❌ Network error. Check your connection.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-12 md:py-24">
    <div className="container max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
      {/* Intro Section */}
      <section className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Let's Chat!</h1>
            <p className="text-lg text-gray-300">
              Got questions? We've got answers. Whether you need help with an order, want to suggest a new product, or just want to say hi - we're all ears.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-300">
            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-default">
              <i className="fas fa-map-marker-alt text-2xl text-blue-500 mt-1"></i>
              <div>
                <h3 className="font-bold text-white text-lg">Visit Us</h3>
                <p>Gwagwalada, Abuja,<br/>Nigeria</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-default">
              <i className="fas fa-phone-alt text-2xl text-green-500 mt-1"></i>
              <div>
                <h3 className="font-bold text-white text-lg">Call Us</h3>
                <p>+234 701 175 5321</p>
                <p className="text-sm mt-1">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-default">
              <i className="fas fa-envelope text-2xl text-purple-500 mt-1"></i>
              <div>
                <h3 className="font-bold text-white text-lg">Email Us</h3>
                <p>support@redstore.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-default">
              <i className="fas fa-clock text-2xl text-yellow-500 mt-1"></i>
              <div>
                <h3 className="font-bold text-white text-lg">Hours</h3>
                <p>Mon - Fri: 9AM - 6PM</p>
                <p>Sat: 10AM - 4PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-1/2">
          {formMessage.show && (
            <div className={`p-4 mb-6 rounded-xl font-semibold transform transition-all ${
              formMessage.type === "success" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
              formMessage.type === "error" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
              "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}>
              {formMessage.text}
            </div>
          )}

          <form className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="b403125a-6b32-47b4-9028-3954d4ebc00f" />
            <input type="hidden" name="subject" value="New Message from RedStore Website" />
            <input type="hidden" name="from_name" value="RedStore Contact Form" />
            <input type="checkbox" name="botcheck" className="hidden" />

            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Send Us a Message</h2>

            <div className="space-y-4 text-gray-200">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Full Name</label>
                <input type="text" name="name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Email Address</label>
                <input type="email" name="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Subject (Optional)</label>
                <input type="text" name="subject_custom" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition" placeholder="How can we help?" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">Message</label>
                <textarea name="message" required rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition resize-none" placeholder="Write your message here..."></textarea>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl transition shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2">
              <i className="fas fa-paper-plane"></i> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-12 pb-16 border-t border-white/10 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition cursor-default">
            <h3 className="text-lg font-bold text-white mb-3">What if my gear doesn't fit right?</h3>
            <p className="text-gray-400">No worries! We've got a 30-day return policy. If it doesn't fit or you just don't love it, send it back. We only ask that items are unworn with tags still on.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition cursor-default">
            <h3 className="text-lg font-bold text-white mb-3">How long until I get my order?</h3>
            <p className="text-gray-400">Usually 3-5 days for standard shipping. Need it faster? We offer express shipping that gets there in 1-2 days. International orders take a bit longer.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition cursor-default">
            <h3 className="text-lg font-bold text-white mb-3">Do you ship worldwide?</h3>
            <p className="text-gray-400">Yep! We ship to over 50 countries. Shipping costs and times vary by location, but you'll see all the details when you check out.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition cursor-default">
            <h3 className="text-lg font-bold text-white mb-3">How can I track my package?</h3>
            <p className="text-gray-400">We'll email you a tracking number as soon as your order ships. You can also log into your account on our site to see where your gear is at.</p>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
