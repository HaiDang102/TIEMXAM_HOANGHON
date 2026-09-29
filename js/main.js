/**
 * XỬ LÝ CHÍNH TRANG WEB HOÀNG HÔN TATTOO (MAIN LOGIC)
 * -----------------------------------------------------------------------------
 * Hỗ trợ 7 trang: index.html, gioi-thieu.html, dich-vu.html, tac-pham.html,
 * bang-gia.html, dat-lich.html, lien-he.html.
 * -----------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. KHỞI TẠO DỮ LIỆU CỬA HÀNG TỪ CONFIG
  // ---------------------------------------------------------------------------
  const initOwnerData = () => {
    // Tên shop & Tiêu đề
    document.querySelectorAll('.owner-name').forEach(el => el.textContent = OWNER.name || 'HOÀNG HÔN TATTOO');
    document.querySelectorAll('.owner-artist').forEach(el => el.textContent = OWNER.artistName || 'Hoàng Hôn');
    document.querySelectorAll('.owner-exp').forEach(el => el.textContent = OWNER.yearsExp || '7');
    document.querySelectorAll('.owner-address').forEach(el => el.textContent = OWNER.address || '[Chưa điền địa chỉ]');
    document.querySelectorAll('.owner-phone').forEach(el => {
      el.textContent = OWNER.formattedPhone || OWNER.phone;
      if (el.tagName === 'A') el.href = `tel:${OWNER.phone}`;
    });

    // Zalo & Call buttons
    const callBtns = document.querySelectorAll('.btn-call');
    callBtns.forEach(btn => btn.href = `tel:${OWNER.phone}`);

    // Google Maps link & iframe
    const mapBtn = document.getElementById('gmLink');
    if (mapBtn) mapBtn.href = OWNER.mapUrl;

    const mapIframe = document.getElementById('gmapIframe');
    if (mapIframe && OWNER.mapEmbedUrl) {
      mapIframe.src = OWNER.mapEmbedUrl;
    }

    // Social links
    const instLink = document.getElementById('socialInst');
    if (instLink) instLink.href = OWNER.social.instagram || '#';
    const fbLink = document.getElementById('socialFb');
    if (fbLink) fbLink.href = OWNER.social.facebook || '#';
    const ttLink = document.getElementById('socialTt');
    if (ttLink) ttLink.href = OWNER.social.tiktok || '#';
  };

  initOwnerData();

  // ---------------------------------------------------------------------------
  // 2. RENDER GALLERY TÁC PHẨM & BỘ LỌC (Dành cho tac-pham.html & index.html)
  // ---------------------------------------------------------------------------
  let currentCategory = 'Tất cả';
  let filteredArtworks = typeof ARTWORKS !== 'undefined' ? [...ARTWORKS] : [];
  let currentLightboxIndex = 0;

  const tagsContainer = document.getElementById('tags');
  const gridContainer = document.getElementById('grid');
  const homeFeaturedContainer = document.getElementById('home-featured-grid');

  // Danh mục phong cách có thêm ghi chú tiếng Việt
  const catNames = {
    'Tất cả': 'Tất cả',
    'Blackwork': 'Blackwork (Mực đen)',
    'Lettering': 'Lettering (Xăm chữ)',
    'Japanese': 'Japanese (Kiểu Nhật)',
    'Minimalist': 'Minimalist (Tối giản)',
    'Realism': 'Realism (Hiện thực)',
    'Dotwork': 'Dotwork (Xăm chấm)'
  };

  const categories = ['Tất cả', 'Blackwork', 'Lettering', 'Japanese', 'Minimalist', 'Realism', 'Dotwork'];

  const renderGallery = () => {
    if (typeof ARTWORKS === 'undefined') return;

    // Render Tags trên trang tac-pham.html
    if (tagsContainer) {
      tagsContainer.innerHTML = '';
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = catNames[cat] || cat;
        btn.className = (cat === currentCategory) ? 'on' : '';
        btn.onclick = () => {
          currentCategory = cat;
          renderGallery();
        };
        tagsContainer.appendChild(btn);
      });
    }

    // Lọc danh sách tác phẩm theo category
    filteredArtworks = (currentCategory === 'Tất cả')
      ? [...ARTWORKS]
      : ARTWORKS.filter(item => item.category === currentCategory);

    // Render Grid Cards trên trang tac-pham.html
    if (gridContainer) {
      gridContainer.innerHTML = '';
      
      if (filteredArtworks.length === 0) {
        gridContainer.innerHTML = '<p style="color:var(--mu);grid-column:1/-1;text-align:center;padding:40px 0;">Chưa có tác phẩm trong danh mục này.</p>';
        return;
      }

      filteredArtworks.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card reveal-on-scroll';
        card.style.setProperty('--card-index', index);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Xem chi tiết tác phẩm ${item.title}`);

        card.innerHTML = `
          <div class="card-img-wrap">
            <img 
              src="${item.image}" 
              alt="${item.title}" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='assets/images/placeholder.svg';"
            />
          </div>
          <span class="sans">${item.title} · ${item.category}</span>
        `;

        const openCard = () => openLightbox(index);
        card.onclick = openCard;
        card.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCard();
          }
        };

        gridContainer.appendChild(card);
      });

      if (typeof initScrollReveal === 'function') {
        initScrollReveal();
      }
    }

    // Render 6 tác phẩm nổi bật trên Trang chủ (index.html)
    if (homeFeaturedContainer) {
      homeFeaturedContainer.innerHTML = '';
      const featuredItems = ARTWORKS.slice(0, 6);
      featuredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card reveal-on-scroll';
        card.innerHTML = `
          <div class="card-img-wrap">
            <img 
              src="${item.image}" 
              alt="${item.title}" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='assets/images/placeholder.svg';"
            />
          </div>
          <span class="sans">${item.title} · ${item.category}</span>
        `;
        card.onclick = () => {
          window.location.href = 'tac-pham.html';
        };
        homeFeaturedContainer.appendChild(card);
      });

      if (typeof initScrollReveal === 'function') {
        initScrollReveal();
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 3. LIGHTBOX MODAL (Xem ảnh lớn, nút Trước/Sau, Esc key)
  // ---------------------------------------------------------------------------
  const lightbox = document.getElementById('lb');
  const lbImg = document.getElementById('lbi');
  const lbCategory = document.getElementById('lbc');
  const lbTitle = document.getElementById('lbt');
  const lbDetails = document.getElementById('lbd');
  const lbDesc = document.getElementById('lbdesc');
  const lbPrevBtn = document.getElementById('lbPrev');
  const lbNextBtn = document.getElementById('lbNext');
  const lbCloseBtn = document.getElementById('lbClose');
  const lbBookBtn = document.getElementById('lbBookBtn');

  const updateLightboxContent = (index) => {
    if (index < 0) index = filteredArtworks.length - 1;
    if (index >= filteredArtworks.length) index = 0;
    currentLightboxIndex = index;

    const item = filteredArtworks[currentLightboxIndex];
    if (!item) return;

    if (lbImg) {
      lbImg.src = item.image;
      lbImg.alt = item.title;
      lbImg.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/placeholder.svg';
      };
    }
    if (lbCategory) lbCategory.textContent = item.category;
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbDetails) lbDetails.textContent = item.details;
    if (lbDesc) lbDesc.textContent = item.description || '';
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    if (lightbox) {
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  const showPrevArtwork = (e) => {
    if (e) e.stopPropagation();
    updateLightboxContent(currentLightboxIndex - 1);
  };

  const showNextArtwork = (e) => {
    if (e) e.stopPropagation();
    updateLightboxContent(currentLightboxIndex + 1);
  };

  if (lbPrevBtn) lbPrevBtn.onclick = showPrevArtwork;
  if (lbNextBtn) lbNextBtn.onclick = showNextArtwork;
  if (lbCloseBtn) lbCloseBtn.onclick = closeLightbox;

  if (lightbox) {
    lightbox.onclick = (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    };
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevArtwork();
    } else if (e.key === 'ArrowRight') {
      showNextArtwork();
    }
  });

  // Nút "Tôi muốn hình tương tự" -> chuyển tới dat-lich.html?dichvu=xam-hinh
  if (lbBookBtn) {
    lbBookBtn.onclick = () => {
      closeLightbox();
      window.location.href = 'dat-lich.html?dichvu=xam-hinh';
    };
  }

  renderGallery();

  // ---------------------------------------------------------------------------
  // 4. LIQUID GLASS NAVIGATION ENGINE & ACTIVE PAGE HIGHLIGHT
  // ---------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('nav a.nav-link');
  const navIndicator = document.getElementById('navIndicator');
  const displacementMap = document.getElementById('glassDisplacement');

  let currentIndicatorState = { x: 0, width: 0 };
  let isTransitTimer = null;

  const updateNavIndicator = (targetLink, isClick = false) => {
    if (!navIndicator || !targetLink || window.innerWidth <= 768) {
      if (navIndicator) navIndicator.style.opacity = '0';
      return;
    }

    const parentRect = navIndicator.parentElement.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const targetX = linkRect.left - parentRect.left;
    const targetWidth = linkRect.width;
    const targetHeight = linkRect.height;
    const targetTop = linkRect.top - parentRect.top;

    const deltaX = targetX - currentIndicatorState.x;
    const isMoving = Math.abs(deltaX) > 5 && currentIndicatorState.width > 0;

    let scaleX = 1;
    if (isMoving) {
      scaleX = 1 + Math.min(Math.abs(deltaX) / 200, 0.22);
    }
    if (isClick) {
      scaleX = 0.94;
    }

    if (displacementMap && isMoving) {
      displacementMap.setAttribute('scale', '12');
      clearTimeout(isTransitTimer);
      isTransitTimer = setTimeout(() => {
        displacementMap.setAttribute('scale', '4');
      }, 480);
    }

    navIndicator.style.left = `${targetX}px`;
    navIndicator.style.top = `${targetTop}px`;
    navIndicator.style.width = `${targetWidth}px`;
    navIndicator.style.height = `${targetHeight}px`;
    navIndicator.style.opacity = '1';
    navIndicator.style.transform = `scaleX(${scaleX})`;

    if (isMoving || isClick) {
      setTimeout(() => {
        navIndicator.style.transform = 'scaleX(1)';
      }, isClick ? 120 : 380);
    }

    currentIndicatorState = { x: targetX, width: targetWidth };
  };

  // Xác định trang hiện tại để Highlight Nav Link
  const highlightCurrentPageNav = () => {
    const path = window.location.pathname;
    let pageName = path.split('/').pop() || 'index.html';
    if (pageName === '') pageName = 'index.html';

    let matchedLink = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      link.removeAttribute('aria-current');

      if (href === pageName || (pageName === 'index.html' && (href === 'index.html' || href === './'))) {
        matchedLink = link;
      }
    });

    if (matchedLink) {
      matchedLink.classList.add('active');
      matchedLink.setAttribute('aria-current', 'page');
      setTimeout(() => updateNavIndicator(matchedLink), 50);
    }
  };

  highlightCurrentPageNav();

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => updateNavIndicator(link));
    link.addEventListener('mouseleave', () => {
      const activeLink = document.querySelector('nav a.nav-link.active') || navLinks[0];
      updateNavIndicator(activeLink);
    });
  });

  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('nav a.nav-link.active') || navLinks[0];
    updateNavIndicator(activeLink);
  });

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (navbar) {
    navbar.addEventListener('mousemove', (e) => {
      const rect = navbar.getBoundingClientRect();
      navbar.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      navbar.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. MENU TRÊN ĐIỆN THOẠI (MOBILE MENU TOGGLE)
  // ---------------------------------------------------------------------------
  if (navToggle && navbar) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navbar.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. LIQUID SCROLL REVEAL (Sóng nước cuộn mượt)
  // ---------------------------------------------------------------------------
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    document.body.classList.add('js-reveal-active');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '100px 0px 50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    }, 100);
  };

  initScrollReveal();

  // ---------------------------------------------------------------------------
  // 7. XỬ LÝ DYNAMIC FORM ĐẶT LỊCH (?dichvu=xam-hinh|xo-khuyen|vo-bi)
  // ---------------------------------------------------------------------------
  const bookingForm = document.getElementById('f');
  const typeSelect = document.querySelector('select[name="type"]');
  const styleLabel = document.getElementById('lblStyle');
  const placeLabel = document.getElementById('lblPlace');
  const placeInputText = document.getElementById('txtPlaceLabel');
  const ideaInput = document.querySelector('textarea[name="idea"]');
  const ageCheckContainer = document.getElementById('ageCheckContainer');
  const ageCheckInput = document.getElementById('chkAge18');
  const dateInputEl = document.getElementById('dateInput');

  // Đặt ngày hẹn tối thiểu là ngày hôm nay (Không chọn được ngày quá khứ)
  if (dateInputEl) {
    const todayStr = new Date().toISOString().split('T')[0];
    dateInputEl.setAttribute('min', todayStr);
  }

  // Đọc tham số URL ?dichvu=
  const urlParams = new URLSearchParams(window.location.search);
  const dichVuParam = urlParams.get('dichvu');

  const updateFormFields = (serviceType) => {
    if (!bookingForm) return;

    // Reset mặc định hiển thị tất cả
    if (styleLabel) styleLabel.style.display = 'block';
    if (placeLabel) placeLabel.style.display = 'block';
    if (ageCheckContainer) ageCheckContainer.style.display = 'none';
    if (txtPlaceLabel) txtPlaceLabel.textContent = 'Vị trí xăm *';
    if (ideaInput) ideaInput.placeholder = 'Mô tả ngắn gọn ý tưởng, ý nghĩa hoặc mong muốn của bạn...';

    if (serviceType === 'Xỏ khuyên' || serviceType === 'xo-khuyen') {
      if (typeSelect) typeSelect.value = 'Xỏ khuyên';
      if (styleLabel) styleLabel.style.display = 'none';
      if (txtPlaceLabel) txtPlaceLabel.textContent = 'Vị trí xỏ khuyên *';
      if (ageCheckContainer) ageCheckContainer.style.display = 'flex';
      if (ideaInput) ideaInput.placeholder = 'Loại khuyên / trang sức bạn muốn chọn (Ví dụ: Khuyên tai vành, khuyên rốn...)...';
    } else if (serviceType === 'Vô bi' || serviceType === 'vo-bi') {
      if (typeSelect) typeSelect.value = 'Vô bi';
      if (styleLabel) styleLabel.style.display = 'none';
      if (placeLabel) placeLabel.style.display = 'none';
      if (ageCheckContainer) ageCheckContainer.style.display = 'flex';
      if (ideaInput) ideaInput.placeholder = 'Ghi chú yêu cầu tư vấn riêng tư (Số lượng mong muốn...)...';
    } else if (serviceType === 'Xăm hình' || serviceType === 'xam-hinh') {
      if (typeSelect) typeSelect.value = 'Xăm hình';
    }
  };

  // Tự động set form theo URL query param
  if (dichVuParam) {
    updateFormFields(dichVuParam);
  }

  // Khi người dùng tự chọn loại dịch vụ trong Select
  if (typeSelect) {
    typeSelect.addEventListener('change', (e) => {
      updateFormFields(e.target.value);
    });
  }

  // Submit Form Đặt lịch
  const resContainer = document.getElementById('res');
  const resTitle = document.getElementById('rt');
  const resDesc = document.getElementById('rp');
  const btnZalo = document.getElementById('bz');

  if (bookingForm) {
    bookingForm.onsubmit = function(e) {
      e.preventDefault();

      const formData = new FormData(this);

      // Chống spam honeypot
      if (formData.get('website')) {
        return false;
      }

      // KIỂM TRA NGÀY HẸN (Phải từ hôm nay trở đi)
      const selectedDateVal = formData.get('date');
      if (selectedDateVal) {
        const selectedDate = new Date(selectedDateVal + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          alert('Ngày hẹn không hợp lệ! Vui lòng chọn ngày hôm nay hoặc các ngày trong tương lai.');
          return false;
        }
      }

      const selectedType = formData.get('type');

      // KIỂM TRA ĐỘ TUỔI CHO XỎ KHUYÊN VÀ VÔ BI (Bắt buộc đủ 18 tuổi)
      if (selectedType === 'Vô bi' || selectedType === 'Xỏ khuyên') {
        // Kiểm tra checkbox xác nhận 18+
        if (ageCheckInput && !ageCheckInput.checked) {
          alert(`Vui lòng đánh dấu xác nhận bạn đã đủ 18 tuổi để đăng ký dịch vụ ${selectedType}.`);
          return false;
        }
      }

      // Soạn nội dung tin nhắn gửi Zalo / Google Sheet
      let msg = `=== YÊU CẦU ĐẶT LỊCH HOÀNG HÔN TATTOO ===\n`;
      const fields = [
        ['Họ tên', 'name'],
        ['SĐT/Zalo', 'phone'],
        ['Email', 'email'],
        ['Dịch vụ', 'type'],
        ['Ngày mong muốn', 'date'],
        ['Khung giờ', 'time'],
        ['Phong cách', 'style'],
        ['Vị trí', 'place'],
        ['Ý tưởng / Ghi chú', 'idea'],
        ['Sức khỏe', 'health']
      ];

      fields.forEach(([label, key]) => {
        const val = formData.get(key);
        if (val) {
          msg += `${label}: ${val}\n`;
        }
      });

      if (btnZalo) {
        btnZalo.onclick = function() {
          try {
            navigator.clipboard.writeText(msg);
          } catch (err) {
            console.log('Clipboard error:', err);
          }
          alert('Đã sao chép nội dung thông tin đặt lịch!\nBạn sẽ được chuyển sang Zalo của tiệm, hãy dán (Paste) vào tin nhắn gửi tiệm nhé.');
          window.open(`https://zalo.me/${OWNER.zalo}`, '_blank');
        };
      }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');

      const showResult = () => {
        if (resContainer) {
          resContainer.classList.add('show');
          resContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      if (!OWNER.endpoint) {
        if (resTitle) resTitle.textContent = 'Yêu cầu đã được soạn xong.';
        if (resDesc) resDesc.textContent = 'Bấm chọn nút bên dưới để gửi tin nhắn trực tiếp qua Zalo hoặc Gọi điện:';
        showResult();
        return;
      }

      const dataObj = {};
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi yêu cầu...';
      }

      fetch(OWNER.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(dataObj)
      })
      .then(() => {
        if (resTitle) resTitle.textContent = 'Đã gửi lịch hẹn thành công!';
        if (resDesc) resDesc.textContent = 'Cảm ơn bạn! Tiệm sẽ liên hệ xác nhận trong vòng 24 giờ. Bạn có thể bấm nút gửi qua Zalo để nhắn tin nhanh với tiệm.';
        bookingForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Gửi yêu cầu đặt lịch';
        }
        showResult();
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        if (resTitle) resTitle.textContent = 'Chưa gửi được tự động.';
        if (resDesc) resDesc.textContent = `Vui lòng bấm chọn "Gửi qua Zalo" hoặc gọi trực tiếp số ${OWNER.formattedPhone || OWNER.phone}:`;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Gửi yêu cầu đặt lịch';
        }
        showResult();
      });
    };
  }
});
