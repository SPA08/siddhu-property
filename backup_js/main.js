/* ==========================================================================
   Siddhu Property Advisor - Interactive JavaScript
   CEO: Naeem Siddhu | Contact: +92 306 3996764 | info@siddhupropertyadvisor.com
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Interactive Town Overlay Cards Toggle & Map Focus
  const townCards = document.querySelectorAll('.town-badge-card');
  const mapIframe = document.querySelector('.live-map-iframe');

  const townMapLocations = {
    'hayat-abad': 'https://maps.google.com/maps?q=Siddhu+Property+Advisor,+Tower+Road+Side,+Hayatabad,+Chichawatni,+Punjab+57200,+Pakistan&t=&z=18&ie=UTF8&iwloc=B&output=embed',
    'model-town': 'https://maps.google.com/maps?q=Model+Town,+Chichawatni,+Punjab,+Pakistan&t=&z=17&ie=UTF8&iwloc=B&output=embed',
    'green-town': 'https://maps.google.com/maps?q=Green+Town,+Chichawatni,+Punjab,+Pakistan&t=&z=17&ie=UTF8&iwloc=B&output=embed',
    'housing-colony': 'https://maps.google.com/maps?q=Housing+Colony,+Chichawatni,+Punjab,+Pakistan&t=&z=17&ie=UTF8&iwloc=B&output=embed'
  };

  townCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all cards
      townCards.forEach(c => c.classList.remove('active'));
      // Add active to clicked card so remaining cards slide/fade
      card.classList.add('active');

      const townKey = card.getAttribute('data-town');
      if (townKey && townMapLocations[townKey] && mapIframe) {
        mapIframe.src = townMapLocations[townKey];
      }
    });
  });

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Intersection Observer for Smooth Scroll Reveal
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  const animatableSelectors = [
    'section .section-title',
    'section .section-subtitle',
    '.property-card',
    '.why-card',
    '.review-card',
    '.featured-card',
    '.map-explorer-card',
    '.ceo-grid',
    '.cta-banner'
  ];

  document.querySelectorAll(animatableSelectors.join(', ')).forEach(el => {
    el.classList.add('reveal-on-scroll');
    scrollObserver.observe(el);
  });

  // N8N AI Assistant Chat Window & Webhook Handler
  const n8nLauncher = document.getElementById('n8nChatLauncher');
  const n8nWindow = document.getElementById('n8nChatWindow');
  const n8nClose = document.getElementById('n8nChatClose');
  const n8nInput = document.getElementById('n8nChatInput');
  const n8nSend = document.getElementById('n8nChatSend');
  const n8nBody = document.getElementById('n8nChatBody');

  const webhookUrl = 'https://meesumali77.app.n8n.cloud/webhook/a8537389-b51a-4f87-a8cc-b0abaf03b6f8/chat';

  if (n8nLauncher && n8nWindow) {
    n8nLauncher.addEventListener('click', () => {
      n8nWindow.classList.toggle('open');
      if (n8nWindow.classList.contains('open') && n8nInput) {
        n8nInput.focus();
      }
    });

    if (n8nClose) {
      n8nClose.addEventListener('click', () => {
        n8nWindow.classList.remove('open');
      });
    }

    const escapeHTML = (str) => {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    };

    const sendUserMessage = async () => {
      const text = n8nInput ? n8nInput.value.trim() : '';
      if (!text) return;

      // Append user msg
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'n8n-msg user-msg';
      userMsgDiv.innerHTML = `<div class="n8n-msg-content">${escapeHTML(text)}</div>`;
      n8nBody.appendChild(userMsgDiv);

      n8nInput.value = '';
      n8nBody.scrollTop = n8nBody.scrollHeight;

      // Append typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'n8n-msg bot-msg';
      typingDiv.id = 'n8nTyping';
      typingDiv.innerHTML = `<div class="n8n-msg-content"><i class="fa-solid fa-circle-notch fa-spin"></i> Checking with Naeem Siddhu's AI...</div>`;
      n8nBody.appendChild(typingDiv);
      n8nBody.scrollTop = n8nBody.scrollHeight;

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, chatInput: text, action: 'sendMessage' })
        });

        const typingEl = document.getElementById('n8nTyping');
        if (typingEl) typingEl.remove();

        let replyText = 'Thank you for your message. How else can Naeem Siddhu assist you?';
        if (response.ok) {
          const resData = await response.json().catch(() => null);
          if (resData) {
            replyText = resData.output || resData.message || resData.text || resData.response || (typeof resData === 'string' ? resData : JSON.stringify(resData));
          }
        }

        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'n8n-msg bot-msg';
        botMsgDiv.innerHTML = `<div class="n8n-msg-content">${escapeHTML(replyText)}</div>`;
        n8nBody.appendChild(botMsgDiv);
        n8nBody.scrollTop = n8nBody.scrollHeight;

      } catch (err) {
        const typingEl = document.getElementById('n8nTyping');
        if (typingEl) typingEl.remove();

        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'n8n-msg bot-msg';
        botMsgDiv.innerHTML = `<div class="n8n-msg-content">Thank you for reaching out! You can also connect directly with Naeem Siddhu at <strong>+92 306 3996764</strong>.</div>`;
        n8nBody.appendChild(botMsgDiv);
        n8nBody.scrollTop = n8nBody.scrollHeight;
      }
    };

    if (n8nSend) n8nSend.addEventListener('click', sendUserMessage);
    if (n8nInput) {
      n8nInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
      });
    }
  }

  // Lightbox Modal Setup
  const modal = document.getElementById('propertyModal');
  const modalClose = document.getElementById('modalClose');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Footer Entrance Animation (Runs once when footer enters viewport)
  const footerEl = document.querySelector('.site-footer, footer');
  if (footerEl) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footerEl.classList.add('animated-in');
          footerObserver.unobserve(footerEl);
        }
      });
    }, { threshold: 0.1 });
    footerObserver.observe(footerEl);
  }

});

// Direct WhatsApp Inquiry Trigger Function
function openWhatsAppInquiry(propertyTitle = 'General Property Inquiry') {
  const phone = '923063996764'; // Official Contact Number for Naeem Siddhu
  const message = `Assalam-o-Alaikum Naeem Siddhu Sahab! I am visiting the Siddhu Property Advisor website and inquiring about: ${propertyTitle}. Please share details.`;
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank');
}

// Lightbox Modal Opener
function openPropertyModal(imgSrc, title, location, specs) {
  const modal = document.getElementById('propertyModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocation = document.getElementById('modalLocation');
  const modalSpecs = document.getElementById('modalSpecs');

  if (modalImg) modalImg.src = imgSrc;
  if (modalTitle) modalTitle.textContent = title;
  if (modalLocation) modalLocation.textContent = location;
  if (modalSpecs) modalSpecs.textContent = specs;

  if (modal) modal.classList.add('active');
}
