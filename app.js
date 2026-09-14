/**
 * TƯ TƯỞNG HỒ CHÍ MINH — BÀI BÁO CÁO THUYẾT TRÌNH TƯƠNG TÁC CHƯƠNG 3
 * Thiết kế Neo-Brutalism hiện đại, thuần Việt 100%, chuẩn mực học thuật
 */

const Deck = (function () {
  'use strict';

  // --- HIỆU ỨNG ÂM THANH TỔNG HỢP ---
  const AudioFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    },
    click() { this.playTone(600, 'triangle', 0.04, 0.05); },
    success() {
      this.playTone(523.25, 'sine', 0.08, 0.08);
      setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 70);
      setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.1), 140);
    },
    error() {
      this.playTone(200, 'sawtooth', 0.12, 0.08);
    },
    fanfare() {
      [440, 554, 659, 880].forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'sine', 0.2, 0.12), i * 90);
      });
    }
  };

  // --- TRẠNG THÁI TOÀN CỤC BÀI THUYẾT TRÌNH ---
  const State = {
    currentSlide: 0,
    totalSlides: 15,

    // Chặng 1: My
    lv1: {
      clues: [false, false, false, false],
      quizStatus: { 1: null, 2: null, 3: null, 4: null },
      currentCardPage: { 1: 0, 2: 0, 3: 0, 4: 0 },
      hasVisitedStep3: { 1: false, 2: false, 3: false, 4: false }
    },

    // Chặng 2: Thịnh
    lv2: {
      choices: {}
    },

    // Chặng 3: Vinh
    lv3: {
      pol: 0, eco: 0, cul: 0, soc: 0, built: false
    },

    // Chặng 4: Tân
    lv4: {
      currentIdx: 1
    },

    // Tổng kết & Tranh luận: Ánh
    boss: {
      pollSelected: null
    },

    // Slide 11: Ghép nối chuỗi logic (Puzzle)
    chain: {
      selectedCardId: null,
      slots: { 1: null, 2: null, 3: null, 4: null }
    },

    // Slide 12: Mini game 4 nhóm & Trao thưởng MoMo
    minigame: {
      momoQRs: {
        first: localStorage.getItem('hcm_momo_first') || '',
        second: localStorage.getItem('hcm_momo_second') || ''
      },
      teams: [
        { id: 1, name: "Nhóm 1", score: 0, correct: 0 },
        { id: 2, name: "Nhóm 2", score: 0, correct: 0 },
        { id: 3, name: "Nhóm 3", score: 0, correct: 0 },
        { id: 4, name: "Nhóm 4", score: 0, correct: 0 }
      ],
      selectedTeamId: 1,
      boxes: [],
      activeBoxIdx: null,
      assembledWords: [],
      remainingWords: [],
      isAnswerRevealed: false
    }
  };

  // --- DỮ LIỆU CHẶNG 1: BẢN ĐỒ TƯ LIỆU LỊCH SỬ (MY) ---
  const HOTSPOTS = {
    1: {
      badge: "ĐIỂM TƯ LIỆU 01 // NĂM 1919 • QUYỀN THIÊNG LIÊNG",
      img: "assets/images/hotspot1_1919.jpg",
      caption: "Bản Yêu sách của nhân dân An Nam (1919) — Nguyễn Ái Quốc tại Hội nghị Versailles",
      quote: "“Cái mà tôi cần nhất trên đời này là đồng bào tôi được tự do, Tổ quốc tôi được độc lập.” — Hồ Chí Minh",
      question: "Theo tư tưởng Hồ Chí Minh được thể hiện qua các sự kiện từ năm 1919 đến 1965, “độc lập, tự do” có ý nghĩa như thế nào đối với dân tộc Việt Nam?",
      options: [
        { key: "A", text: "Độc lập, tự do là quyền cơ bản của mọi dân tộc, nhưng có thể được giới hạn trong những trường hợp cần thiết để bảo đảm hòa bình." },
        { key: "B", text: "Độc lập, tự do là quyền thiêng liêng và bất khả xâm phạm của mọi dân tộc, vì vậy không dân tộc nào có quyền tước đoạt quyền ấy của dân tộc khác.", correct: true },
        { key: "C", text: "Độc lập, tự do là quyền tự nhiên của mọi dân tộc, nhưng chỉ trở thành hiện thực khi được một quốc gia có chủ quyền chính thức công nhận." },
        { key: "D", text: "Độc lập, tự do là quyền chính trị của mỗi dân tộc, được bảo đảm chủ yếu thông qua việc xây dựng một nhà nước độc lập và có đủ sức mạnh quân sự." }
      ],
      clue: "MANH MỐI 01: Độc lập tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc.",
      cardPages: [
        {
          partTitle: "Phần 1: Khát khao của dân tộc & Bản Yêu sách 1919",
          cards: [
            {
              title: "1. KHÁT KHAO CỦA DÂN TỘC VIỆT NAM",
              body: `<p>Lịch sử dựng nước và giữ nước gắn liền với truyền thống yêu nước nồng nàn, anh dũng đấu tranh chống giặc ngoại xâm.</p><p>Đó là khát khao to lớn cháy bỏng: luôn mong muốn có độc lập cho dân tộc, tự do cho nhân dân.</p><blockquote>“Cái mà tôi cần nhất trên đời này là đồng bào tôi được tự do, Tổ quốc tôi được độc lập.”<br>— Hồ Chí Minh</blockquote>`
            },
            {
              title: "2. BẢN YÊU SÁCH CỦA NHÂN DÂN AN NAM (1919)",
              body: `<p>Hồ Chí Minh gửi tới Hội nghị Vécxây (Pháp) Bản Yêu sách của nhân dân An Nam gồm 8 điểm.</p><p><strong>Hai nội dung chính:</strong></p><ul><li>• Đòi quyền bình đẳng về pháp lý.</li><li>• Đòi các quyền tự do, dân chủ cho người Đông Dương.</li></ul><p>→ <em>Dù không được chấp nhận, đây là lần đầu tiên tư tưởng về quyền của các dân tộc thuộc địa, đặc biệt là quyền bình đẳng và tự do, được hình thành rõ nét.</em></p>`
            }
          ]
        },
        {
          partTitle: "Phần 2: Những giá trị phổ quát & Chánh cương vắn tắt 1930",
          cards: [
            {
              title: "3. NHỮNG GIÁ TRỊ PHỔ QUÁT",
              body: `<p>Hồ Chí Minh kế thừa và phát triển những giá trị về quyền con người, quyền tự do và bình đẳng trong:</p><ul><li>• Tuyên ngôn Độc lập của cách mạng Mỹ (1776).</li><li>• Tuyên ngôn Nhân quyền và Dân quyền của cách mạng Pháp (1791).</li></ul><p>Từ đó khẳng định chân lý:</p><blockquote>“Tất cả các dân tộc trên thế giới đều sinh ra bình đẳng, dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do… Đó là những lẽ phải không ai chối cãi được.”</blockquote><p>→ <strong>Quyền dân tộc là những quyền thiêng liêng, bất biến và không thể bị xâm phạm.</strong></p>`
            },
            {
              title: "4. CHÁNH CƯƠNG VẮN TẮT CỦA ĐẢNG (1930)",
              body: `<p><strong>Mục tiêu chính trị cốt lõi của Đảng (1930):</strong></p><ul><li>a) Đánh đổ đế quốc chủ nghĩa Pháp và bọn phong kiến tay sai.</li><li>b) Làm cho nước Nam được hoàn toàn độc lập.</li></ul><p>→ <em>Độc lập dân tộc chính thức trở thành mục tiêu chính trị hàng đầu, xuyên suốt đường lối cách mạng của Đảng.</em></p>`
            }
          ]
        },
        {
          partTitle: "Phần 3: Tuyên ngôn Độc lập 1945 & Hai cuộc kháng chiến bảo vệ nền độc lập",
          cards: [
            {
              title: "5. TUYÊN NGÔN ĐỘC LẬP (1945)",
              body: `<p>Hồ Chí Minh tuyên bố trước quốc dân đồng bào và toàn thế giới:</p><blockquote>“Nước Việt Nam có quyền được hưởng tự do và độc lập, và sự thực đã trở thành một nước tự do và độc lập.”</blockquote><p>Đồng thời đanh thép khẳng định ý chí:</p><blockquote>“Toàn thể dân Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mệnh và của cải để giữ vững quyền tự do và độc lập ấy.”</blockquote><p>→ <em>Độc lập không chỉ là quyền thiêng liêng, mà còn phải được bảo vệ bằng ý chí và hành động của toàn dân.</em></p>`
            },
            {
              title: "6. HAI CUỘC KHÁNG CHIẾN BẢO VỆ ĐỘC LẬP",
              body: `<p>Ý chí bảo vệ độc lập được thể hiện quật cường qua hai cuộc kháng chiến:</p><p><strong>Kháng chiến chống Pháp (1946):</strong></p><blockquote>“Nhân dân chúng tôi thành thật mong muốn hòa bình. Nhưng cũng kiên quyết chiến đấu đến cùng để bảo vệ quyền thiêng liêng nhất: toàn vẹn lãnh thổ cho Tổ quốc và độc lập cho đất nước.”</blockquote><p><strong>Kháng chiến chống Mỹ (19/12/1946 & Lời kêu gọi 1966):</strong></p><blockquote>“Không! Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ.”</blockquote>`
            }
          ]
        },
        {
          partTitle: "Phần 4: Chân lý thời đại 'Không có gì quý hơn độc lập, tự do'",
          cards: [
            {
              single: true,
              title: "7. CHIẾN TRANH VÀ CÔNG LÝ",
              body: `<p>Năm 1965, đế quốc Mỹ đẩy mạnh chiến tranh xâm lược, tiến hành “Chiến tranh cục bộ” ở miền Nam và leo thang phá hoại miền Bắc.</p><p>Trong hoàn cảnh thử thách cam go đó, Chủ tịch Hồ Chí Minh nêu lên chân lý bất hủ của thời đại:</p><blockquote>“Không có gì quý hơn độc lập, tự do.”</blockquote><p>→ <em>Dưới ngọn cờ chân lý ấy, nhân dân Việt Nam đã anh dũng chiến đấu, đánh thắng đế quốc Mỹ, buộc Mỹ phải ký Hiệp định Paris (1973), cam kết tôn trọng các quyền dân tộc cơ bản của Việt Nam và rút quân về nước.</em></p>`
            }
          ]
        },
        {
          isPanoramic: true,
          partTitle: "Đúc kết tri thức: Bức tranh toàn cảnh",
          cards: [
            {
              panoramic: true,
              title: "BỨC TRANH TOÀN CẢNH: QUYỀN THIÊNG LIÊNG BẤT KHẢ XÂM PHẠM",
              body: `<p style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #166534;">Độc lập, tự do theo tư tưởng Hồ Chí Minh:</p><ul><li>✓ <strong>Là quyền thiêng liêng, bất khả xâm phạm</strong> của mọi dân tộc trên thế giới.</li><li>✓ <strong>Là mục tiêu, lý tưởng chiến đấu</strong> cao cả của Đảng và nhân dân Việt Nam.</li><li>✓ <strong>Là giá trị tinh thần vĩnh hằng</strong>, gắn liền với tư tưởng Hồ Chí Minh – hiện thân của khát vọng độc lập, tự do.</li></ul><span class="clue-tag">MANH MỐI 01: Độc lập tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc.</span>`
            }
          ]
        }
      ]
    },
    2: {
      badge: "ĐIỂM TƯ LIỆU 02 // NĂM 1945 • TỰ DO & HẠNH PHÚC",
      img: "assets/images/hotspot2_1945.jpg",
      caption: "Hình ảnh tư liệu về đời sống nhân dân thời kỳ sau Cách mạng Tháng Tám 1945 với nạn đói, nạn mù chữ",
      quote: "“Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.” — Hồ Chí Minh (1945)",
      question: "Chủ tịch Hồ Chí Minh đặt ra yêu cầu cấp bách nào ngay sau khi đất nước giành được độc lập?",
      options: [
        { key: "A", text: "Bảo đảm việc làm, thu nhập và điều kiện sinh hoạt ổn định cho nhân dân trong quá trình xây dựng đất nước." },
        { key: "B", text: "Làm cho dân có ăn, có mặc, có chỗ ở và được học hành.", correct: true },
        { key: "C", text: "Bảo đảm nhân dân được tự do, có quyền làm chủ và có điều kiện tham gia xây dựng chính quyền." },
        { key: "D", text: "Khôi phục sản xuất, phát triển kinh tế và cải thiện đời sống vật chất của nhân dân." }
      ],
      clue: "MANH MỐI 02: Độc lập phải gắn liền với tự do, cơm ăn, áo mặc và hạnh phúc nhân dân.",
      cardPages: [
        {
          partTitle: "Phần 1: Nền tảng tư tưởng & Mục tiêu Cách mạng 1930",
          cards: [
            {
              title: "1. “TAM DÂN” VÀ QUYỀN TỰ DO, BÌNH ĐẲNG",
              body: `<p>Hồ Chí Minh đánh giá cao học thuyết <strong>“Tam dân”</strong> của Tôn Trung Sơn:</p><ul><li>• Dân tộc độc lập</li><li>• Dân quyền tự do</li><li>• Dân sinh hạnh phúc</li></ul><p>Dựa trên tư tưởng về tự do và bình đẳng, Người khẳng định:</p><blockquote>“Dân tộc Việt Nam đương nhiên cũng phải được tự do và bình đẳng về quyền lợi.”</blockquote><span class="clue-tag">CLUE: Độc lập dân tộc phải gắn với tự do của nhân dân.</span>`
            },
            {
              title: "2. MỤC TIÊU CÁCH MẠNG 1930",
              body: `<p>Trong <em>Chánh cương vắn tắt của Đảng (1930)</em>, mục tiêu cách mạng không chỉ hướng tới độc lập, mà còn gắn với quyền lợi thiết thực của nhân dân:</p><ul><li>• Thủ tiêu các thứ quốc trái.</li><li>• Chia ruộng đất của đế quốc cho dân cày nghèo.</li><li>• Bỏ sưu thuế cho dân cày nghèo.</li><li>• Thi hành luật ngày làm 8 giờ.</li></ul><span class="clue-tag">CLUE: Độc lập phải gắn với quyền lợi của nhân dân.</span>`
            }
          ]
        },
        {
          partTitle: "Phần 2: Độc lập gắn liền hạnh phúc & Ham muốn tột bậc của Bác",
          cards: [
            {
              title: "3. ĐỘC LẬP PHẢI MANG LẠI HẠNH PHÚC",
              body: `<p>Sau Cách mạng tháng Tám năm 1945, đất nước còn trong hoàn cảnh đói rét, mù chữ cùng vô vàn khó khăn.</p><p>Hồ Chí Minh đã khẳng định một quan điểm mang tính bản chất:</p><blockquote>“Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.”</blockquote><p>Người yêu cầu thực hiện ngay 4 nhiệm vụ cấp bách:</p><ul><li>• Làm cho dân có ăn.</li><li>• Làm cho dân có mặc.</li><li>• Làm cho dân có chỗ ở.</li><li>• Làm cho dân có học hành.</li></ul><span class="clue-tag">CLUE: Độc lập phải hướng tới hạnh phúc của nhân dân.</span>`
            },
            {
              title: "4. HAM MUỐN TỘT BẬC CỦA CHỦ TỊCH HỒ CHÍ MINH",
              body: `<p><strong>Tâm huyết cả đời của Bác:</strong></p><p>Trong suốt cuộc đời hoạt động vì nước vì dân, Người luôn bộc bạch:</p><blockquote>“Tôi chỉ có một sự ham muốn, ham muốn tột bậc là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành.”</blockquote>`
            }
          ]
        },
        {
          isPanoramic: true,
          partTitle: "Đúc kết tri thức: Bức tranh toàn cảnh",
          cards: [
            {
              panoramic: true,
              title: "BỨC TRANH TOÀN CẢNH: TỰ DO & HẠNH PHÚC DÂN SINH",
              body: `<p style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #166534;">Luận điểm trọng tâm của Chủ tịch Hồ Chí Minh:</p><ul><li>✓ <strong>Độc lập dân tộc phải gắn liền với tự do, cơm ăn, áo mặc và hạnh phúc thiết thực của nhân dân</strong> ("dân hưởng hạnh phúc tự do").</li><li>✓ Độc lập không phải là danh xưng trừu tượng mà phải biến thành hiện thực cuộc sống: ấm no, hạnh phúc, được học hành và được làm chủ.</li></ul><span class="clue-tag">MANH MỐI 02: Độc lập phải gắn liền với cơm ăn, áo mặc, học hành và hạnh phúc nhân dân.</span>`
            }
          ]
        }
      ]
    },
    3: {
      badge: "ĐIỂM TƯ LIỆU 03 // BẢN CHẤT • ĐỘC LẬP HOÀN TOÀN, TRIỆT ĐỂ",
      img: "assets/images/hotspot3_nhahatlon_1945.jpg?v=20260913_2",
      caption: "Mít tinh ngày 19/8/1945 tại Nhà hát Lớn Hà Nội — Giành chính quyền, xóa bỏ chính quyền bù nhìn, khẳng định nền độc lập thực sự",
      quote: "“Độc lập mà không có quyền tự quyết ngoại giao, quân đội riêng, tài chính riêng... thì độc lập đó chẳng có ý nghĩa gì.” — Hồ Chí Minh",
      question: "Tiêu chí của một nền độc lập dân tộc thực sự theo tư tưởng Hồ Chí Minh là gì?",
      options: [
        { key: "A", text: "Có chính phủ do người Việt Nam thành lập và tự quản lý các vấn đề đối nội, còn quốc phòng, tài chính và ngoại giao có thể phụ thuộc vào nước ngoài." },
        { key: "B", text: "Nền độc lập phải được bảo đảm một cách thực sự, hoàn toàn và triệt để trên mọi phương diện, trong đó dân tộc phải có quyền tự quyết về ngoại giao, quân đội và tài chính riêng.", correct: true },
        { key: "C", text: "Giành được chủ quyền về chính trị là yếu tố quyết định; các lĩnh vực kinh tế, quân sự và ngoại giao có thể chấp nhận sự chi phối của nước ngoài nếu vẫn duy trì được chính phủ bản xứ." },
        { key: "D", text: "Độc lập chủ yếu thể hiện ở việc chấm dứt ách thống trị trực tiếp của thực dân, còn việc duy trì sự bảo hộ hoặc hỗ trợ quân sự, tài chính từ nước ngoài không làm mất đi bản chất của nền độc lập." }
      ],
      clue: "MANH MỐI 03: Độc lập phải thực sự, hoàn toàn và triệt để, kiên quyết chống độc lập giả hiệu.",
      cardPages: [
        {
          partTitle: "Phần 1: Nhận diện 'Độc lập giả hiệu'",
          cards: [
            {
              title: "1. CHIÊU BÀI MỊ DÂN CỦA ĐẾ QUỐC",
              body: `<p><strong>Nội dung:</strong> Trong quá trình xâm lược, thực dân đế quốc thường dùng chiêu bài mị dân xảo trá, thành lập các "chính phủ bù nhìn" bản xứ.</p><p><strong>Bản chất:</strong> Chúng tuyên truyền cái gọi là "độc lập tự do giả hiệu" nhằm che đậy bản chất ăn cướp và giết người của chúng ở các nước thuộc địa.</p>`
            },
            {
              title: "2. TIÊU CHÍ CỦA MỘT NỀN ĐỘC LẬP THỰC SỰ",
              body: `<p><strong>Nội dung:</strong> Theo Hồ Chí Minh, độc lập phải là độc lập <strong>thực sự, hoàn toàn và triệt để</strong> trên tất cả các lĩnh vực.</p><p><strong>Luận điểm cốt lõi:</strong></p><blockquote>“Độc lập mà người dân không có quyền tự quyết về ngoại giao, không có quân đội riêng, không có nền tài chính riêng... thì độc lập đó chẳng có ý nghĩa gì.”</blockquote>`
            }
          ]
        },
        {
          partTitle: "Phần 2: Thực tiễn bảo vệ nền độc lập",
          cards: [
            {
              single: true,
              title: "3. BẢO VỆ NỀN ĐỘC LẬP SAU CÁCH MẠNG THÁNG TÁM (1945)",
              body: `<p><strong>Bối cảnh lịch sử:</strong> Đất nước sau Cách mạng tháng Tám gặp vô vàn khó khăn, thử thách ngặt nghèo trong tình trạng “thù trong giặc ngoài”.</p><p><strong>Hành động kiên quyết:</strong> Để bảo vệ nền độc lập thật sự mới giành được, Hồ Chí Minh và Chính phủ Việt Nam Dân chủ Cộng hòa đã sử dụng nhiều biện pháp kiên quyết, linh hoạt — đặc biệt là sách lược ngoại giao tài tình nhằm bảo vệ vững chắc nền độc lập của đất nước.</p>`
            }
          ]
        },
        {
          isPanoramic: true,
          partTitle: "Đúc kết tri thức: Bức tranh toàn cảnh",
          cards: [
            {
              panoramic: true,
              title: "BỨC TRANH TOÀN CẢNH: ĐỘC LẬP HOÀN TOÀN & TRIỆT ĐỂ",
              body: `<p style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #166534;">Chân lý bảo vệ chủ quyền của Bác:</p><ul><li>✓ <strong>Độc lập dân tộc phải là nền độc lập thực sự, hoàn toàn và triệt để trên mọi lĩnh vực</strong> (tự quyết ngoại giao, quân đội riêng, tài chính riêng).</li><li>✓ <strong>Kiên quyết chống độc lập giả hiệu</strong> và mọi chiêu bài bù nhìn do các thế lực ngoại bang áp đặt.</li></ul><span class="clue-tag">MANH MỐI 03: Độc lập phải thực sự, hoàn toàn và triệt để, kiên quyết chống độc lập giả hiệu.</span>`
            }
          ]
        }
      ]
    },
    4: {
      badge: "ĐIỂM TƯ LIỆU 04 // TOÀN VẸN • THỐNG NHẤT & TOÀN VẸN",
      img: "assets/images/hotspot4_thongnhat_1975.jpg?v=20260913_2",
      caption: "Khát vọng non sông liền một dải — Đôi bờ Hiền Lương & Thư gửi đồng bào Nam Bộ (1946)",
      quote: "“Đồng bào Nam Bộ là dân nước Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý đó không bao giờ thay đổi!” — Hồ Chí Minh",
      videoSrc: "assets/images/hotspot4_video_thongnhat_1975.mp4",
      question: "Tư tưởng xuyên suốt, bất biến của Hồ Chí Minh về lãnh thổ và sự thống nhất quốc gia là gì?",
      options: [
        { key: "A", text: "Độc lập dân tộc là mục tiêu trước hết; vấn đề thống nhất đất nước có thể được giải quyết sau khi mỗi miền hoàn thành nhiệm vụ phát triển kinh tế – xã hội riêng." },
        { key: "B", text: "Nước Việt Nam là một, dân tộc Việt Nam là một; độc lập dân tộc phải gắn liền với thống nhất đất nước và bảo vệ vững chắc chủ quyền, toàn vẹn lãnh thổ.", correct: true },
        { key: "C", text: "Việc thống nhất đất nước cần được thực hiện trên cơ sở tôn trọng sự phân chia lãnh thổ được xác lập bởi các hiệp định quốc tế và tương quan lực lượng giữa các nước." },
        { key: "D", text: "Độc lập dân tộc là điều kiện tiên quyết, còn thống nhất lãnh thổ là mục tiêu lâu dài có thể điều chỉnh tùy theo hoàn cảnh chính trị và quan hệ quốc tế." }
      ],
      clue: "MANH MỐI 04: Độc lập dân tộc phải gắn liền với thống nhất Tổ quốc và toàn vẹn lãnh thổ.",
      cardPages: [
        {
          partTitle: "Phần 1: Âm mưu chia cắt của kẻ thù & Lập trường của Bác",
          cards: [
            {
              title: "1. ÂM MƯU 'CHIA ĐỂ TRỊ' CỦA KẺ THÙ",
              body: `<p>Lịch sử dân tộc luôn đối mặt với âm mưu xâm lược và chia cắt đất nước:</p><ul><li>• <em>Thực dân Pháp:</em> Chia nước ta ra ba kỳ với chế độ cai trị riêng, sau đó bày ra "Nam Kỳ tự trị".</li><li>• <em>Sau Cách mạng Tháng Tám:</em> Miền Bắc bị quân Tưởng Giới Thạch chiếm đóng, miền Nam bị thực dân Pháp xâm lược.</li></ul>`
            },
            {
              title: "2. KHẲNG ĐỊNH NAM BỘ LÀ MỘT BỘ PHẬN CỦA VIỆT NAM",
              body: `<p>Trong <em>Thư gửi đồng bào Nam Bộ (1946)</em>, Hồ Chí Minh khẳng định Nam Bộ là một bộ phận máu thịt của Việt Nam, không thể tách rời khỏi Tổ quốc:</p><blockquote>“Đồng bào Nam Bộ là dân nước Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý đó không bao giờ thay đổi.”</blockquote>`
            }
          ]
        },
        {
          partTitle: "Phần 2: Kiên trì thống nhất Tổ quốc & Niềm tin tất thắng",
          cards: [
            {
              title: "3. ĐẤU TRANH SAU HIỆP ĐỊNH GIƠNEVƠ (1954)",
              body: `<p>Khi đất nước tạm thời bị chia cắt làm hai miền theo vĩ tuyến 17, Hồ Chí Minh tiếp tục kiên trì lãnh đạo toàn dân đấu tranh để thống nhất Tổ quốc.</p><p>Tuyên bố bất hủ (Tháng 2/1958):</p><blockquote>“Nước Việt Nam là một, dân tộc Việt Nam là một.”</blockquote>`
            },
            {
              title: "4. NIỀM TIN VÀO SỰ THỐNG NHẤT NƯỚC NHÀ",
              body: `<p>Trong bản <em>Di chúc</em> thiêng liêng, Hồ Chí Minh thể hiện niềm tin tuyệt đối vào thắng lợi của cách mạng và sự thống nhất nước nhà:</p><blockquote>“Đế quốc Mỹ nhất định phải cút khỏi nước ta. Tổ quốc ta nhất định sẽ thống nhất. Đồng bào Nam, Bắc nhất định sẽ sum họp một nhà.”</blockquote><p><strong>Kết luận:</strong> Độc lập dân tộc gắn liền với thống nhất Tổ quốc và toàn vẹn lãnh thổ là tư tưởng xuyên suốt trong cuộc đời hoạt động cách mạng của Hồ Chí Minh.</p>`
            }
          ]
        },
        {
          isPanoramic: true,
          partTitle: "Đúc kết tri thức: Bức tranh toàn cảnh",
          cards: [
            {
              panoramic: true,
              title: "BỨC TRANH TOÀN CẢNH: THỐNG NHẤT & TOÀN VẸN LÃNH THỔ",
              body: `<p style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #166534;">Chân lý lịch sử bất biến:</p><ul><li>✓ <strong>Độc lập dân tộc phải gắn liền với thống nhất Tổ quốc và toàn vẹn lãnh thổ từ Nam ra Bắc.</strong></li><li>✓ Nước Việt Nam là một, dân tộc Việt Nam là một; non sông thu về một mối là quy luật tất yếu và khát vọng cháy bỏng của toàn thể nhân dân Việt Nam.</li></ul><span class="clue-tag">MANH MỐI 04: Độc lập dân tộc phải gắn liền với thống nhất Tổ quốc và toàn vẹn lãnh thổ.</span>`
            }
          ]
        }
      ]
    }
  };

  // --- DỮ LIỆU CHẶNG 2: BẢNG QUYẾT SÁCH CHIẾN LƯỢC (THỊNH - 3.1.2) ---
  // Mỗi quyết sách gồm: 1 Câu hỏi kiểm tra nhận thức + Đúng 1 Trang bài học toàn diện (chuẩn giáo trình Tư tưởng HCM)
  const STRATEGIES = {
    1: {
      name: "CON ĐƯỜNG // CÁCH MẠNG VÔ SẢN",
      img: "assets/images/strat1_tours1920.jpg",
      caption: "Nguyễn Ái Quốc tại Đại hội Tours (12/1920) — Bỏ phiếu tán thành Quốc tế III, tìm ra con đường cứu nước theo cách mạng vô sản",
      q: "Trước sự bế tắc của các phong trào yêu nước cũ, Hồ Chí Minh đã lựa chọn con đường cứu nước nào để giải phóng dân tộc triệt để?",
      options: [
        { key: "A", text: "Con đường phong kiến (tiêu biểu như phong trào Cần Vương, khởi nghĩa Yên Thế)" },
        { key: "B", text: "Con đường dân chủ tư sản (tiêu biểu như phong trào Đông Du của Phan Bội Châu, Duy Tân của Phan Châu Trinh)" },
        { key: "C", text: "Con đường cách mạng vô sản (gắn độc lập dân tộc với chủ nghĩa xã hội)", correct: true }
      ],
      summary: "Đường lối: Cách mạng vô sản — Giải phóng dân tộc triệt để gắn liền với CNXH",
      lesson: {
        badge: "BÀI HỌC CỐT LÕI // 1 TRANG TOÀN DIỆN",
        title: "Bối cảnh lịch sử, Quá trình khảo sát & Sự lựa chọn con đường Cách mạng vô sản",
        html: `
          <div class="strat-grid-2col">
            <!-- CỘT 1: BỐI CẢNH VÀ KHẢO SÁT THẾ GIỚI -->
            <div class="strat-card-box soft-amber">
              <h4>1. BỐI CẢNH LỊCH SỬ & KHỦNG HOẢNG ĐƯỜNG LỐI</h4>
              <ul>
                <li>Cuối thế kỷ XIX – đầu thế kỷ XX: Việt Nam bị thực dân Pháp xâm lược và áp đặt ách thống trị hà khắc.</li>
                <li>Nhiều phong trào yêu nước diễn ra sôi nổi nhưng <strong>đều không thành công</strong> (phong trào Cần Vương, khởi nghĩa Yên Thế, Đông Du, Duy Tân...).</li>
                <li>Điều đó cho thấy: Cách mạng Việt Nam đang rơi vào tình trạng <strong>khủng hoảng sâu sắc về đường lối cứu nước và lực lượng lãnh đạo</strong>.</li>
              </ul>
              
              <h4 style="margin-top: 14px;">2. HỒ CHÍ MINH TÌM KIẾM CON ĐƯỜNG CỨU NƯỚC</h4>
              <ul>
                <li>Hồ Chí Minh không chấp nhận những con đường cứu nước cũ mà chủ động tìm hiểu các cuộc cách mạng trên thế giới.</li>
                <li>Người từng tìm hiểu cách mạng tư sản ở phương Tây (Mỹ, Pháp) nhưng nhận thấy:</li>
              </ul>
              <div class="strat-quote-box">
                <div class="strat-quote-text">“Cách mạng tư sản không giải quyết triệt để vấn đề giải phóng người lao động và các dân tộc thuộc địa.”</div>
              </div>
            </div>

            <!-- CỘT 2: BƯỚC NGOẶT 1917 & LUẬN CƯƠNG LÊNIN 1920 -->
            <div class="strat-card-box soft-green">
              <h4>3. ẢNH HƯỞNG CỦA CÁCH MẠNG THÁNG MƯỜI NGA (1917)</h4>
              <p>Năm 1917, Cách mạng Tháng Mười Nga thắng lợi — sự kiện này có ảnh hưởng sâu sắc đến việc Hồ Chí Minh lựa chọn con đường cứu nước. Người nhận thấy cách mạng Nga hướng tới 4 mục tiêu giải phóng chân chính:</p>
              <div class="strat-flow-pills" style="margin: 8px 0;">
                <span class="strat-flow-node">TỰ DO</span>
                <span class="strat-flow-arrow">•</span>
                <span class="strat-flow-node">BÌNH ĐẲNG</span>
                <span class="strat-flow-arrow">•</span>
                <span class="strat-flow-node">GIẢI PHÓNG NGƯỜI LAO ĐỘNG</span>
                <span class="strat-flow-arrow">•</span>
                <span class="strat-flow-node highlight">GIẢI PHÓNG DÂN TỘC BỊ ÁP BỨC</span>
              </div>

              <h4 style="margin-top: 14px;">4. BƯỚC NGOẶT LỊCH SỬ NĂM 1920</h4>
              <p>Năm 1920, sau khi đọc <em>Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa</em> của V.I. Lênin, Hồ Chí Minh đã tìm thấy con đường giải phóng dân tộc:</p>
              <div class="strat-quote-box green-quote">
                <div class="strat-quote-text">“Muốn cứu nước và giải phóng dân tộc không có con đường nào khác con đường cách mạng vô sản.”</div>
                <div class="strat-quote-author">— HỒ CHÍ MINH</div>
              </div>
              <p style="font-size: 13px; color: #065F46; margin: 0;"><em>Tháng 12/1920 tại Đại hội Tours (Pháp), Người bỏ phiếu tán thành Quốc tế III, trở thành người cộng sản Việt Nam đầu tiên.</em></p>
            </div>
          </div>
        `,
        takeaway: "“Muốn cứu nước và giải phóng dân tộc không có con đường nào khác con đường cách mạng vô sản.” — Đây là sự lựa chọn lịch sử đúng đắn duy nhất, gắn độc lập dân tộc với chủ nghĩa xã hội, giải phóng triệt để dân tộc và nhân dân lao động.",
        speech: "Bối cảnh cuối thế kỷ XIX - đầu thế kỷ XX, đất nước ta bị thực dân Pháp đô hộ. Hàng loạt phong trào yêu nước theo ngọn cờ phong kiến hay dân chủ tư sản đều thất bại vì khủng hoảng đường lối và lực lượng lãnh đạo. Bác Hồ không đi theo lối mòn cũ mà sang phương Tây khảo sát. Nhận thấy cách mạng tư sản không giải quyết triệt để vấn đề giải phóng người lao động, lại chứng kiến Cách mạng Tháng Mười Nga năm 1917 hướng tới tự do, bình đẳng và giải phóng dân tộc thuộc địa, đặc biệt sau khi đọc Luận cương của Lênin năm 1920, Người đã khẳng định: 'Muốn cứu nước và giải phóng dân tộc không có con đường nào khác con đường cách mạng vô sản'."
      }
    },

    2: {
      name: "LỰC LƯỢNG // ĐẠI ĐOÀN KẾT TOÀN DÂN",
      img: "assets/images/strat2_doanket.jpg",
      caption: "Khối đại đoàn kết toàn dân tộc — Cách mạng là sự nghiệp của toàn dân, lấy liên minh công - nông làm gốc",
      q: "Lực lượng của cách mạng giải phóng dân tộc theo Hồ Chí Minh bao gồm những ai?",
      options: [
        { key: "A", text: "Chỉ gồm giai cấp công nhân và tầng lớp trí thức tinh hoa trong xã hội" },
        { key: "B", text: "Toàn dân tộc, toàn thể nhân dân yêu nước; trong đó lấy CÔNG – NÔNG làm gốc cách mạng", correct: true },
        { key: "C", text: "Dựa chủ yếu vào tầng lớp địa chủ phong kiến và tư sản dân tộc" }
      ],
      summary: "Lực lượng: Toàn thể dân tộc, lấy liên minh công - nông làm gốc rễ nền tảng",
      lesson: {
        badge: "BÀI HỌC CỐT LÕI // 1 TRANG TOÀN DIỆN",
        title: "Cơ sở lý luận, Khối đại đoàn kết toàn dân & Vai trò nền tảng gốc rễ của Công – Nông",
        html: `
          <div class="strat-grid-2col">
            <!-- CỘT 1: CƠ SỞ LÝ LUẬN & QUAN ĐIỂM HỒ CHÍ MINH -->
            <div class="strat-card-box soft-amber">
              <h4>1. CƠ SỞ LÝ LUẬN MÁC – LÊNIN</h4>
              <p>Chủ nghĩa Mác – Lênin khẳng định: <strong>Cách mạng là sự nghiệp của quần chúng nhân dân.</strong> V.I. Lênin nhấn mạnh rằng nếu không có sự đồng tình, ủng hộ của đại đa số nhân dân lao động thì cách mạng không thể thành công.</p>

              <h4>2. QUAN ĐIỂM CỦA HỒ CHÍ MINH</h4>
              <p>Hồ Chí Minh kế thừa và phát triển quan điểm trên. Người khẳng định:</p>
              <div class="strat-quote-box green-quote">
                <div class="strat-quote-text">“Cách mệnh là việc chung cả dân chúng chứ không phải việc một hai người.”</div>
                <div class="strat-quote-author">— HỒ CHÍ MINH (ĐƯỜNG KÁCH MỆNH)</div>
              </div>
              <p style="margin: 6px 0;">Và: <strong>“Có dân là có tất cả.”</strong> Do đó, cách mạng giải phóng dân tộc phải đi theo quy trình chặt chẽ:</p>
              <div class="strat-flow-pills" style="margin: 8px 0;">
                <span class="strat-flow-node">TẬP HỢP</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">GIÁC NGỘ</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">TỔ CHỨC</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node highlight">ĐOÀN KẾT TOÀN DÂN</span>
              </div>
            </div>

            <!-- CỘT 2: LỰC LƯỢNG TOÀN DÂN & CÔNG NÔNG LÀ GỐC -->
            <div class="strat-card-box soft-green">
              <h4>3. LỰC LƯỢNG CÁCH MẠNG TOÀN DIỆN</h4>
              <p>Lực lượng cách mạng bao gồm: <strong>Giai cấp công nhân, nông dân, tiểu tư sản, trí thức, trung nông</strong> và các tầng lớp, lực lượng yêu nước khác. Trong <em>Sách lược vắn tắt</em>, Hồ Chí Minh chủ trương liên lạc, tập hợp và tranh thủ các lực lượng có thể tham gia hoặc ủng hộ cách mạng.</p>

              <h4>4. CÔNG – NÔNG LÀ NỀN TẢNG ("GỐC CÁCH MỆNH")</h4>
              <p>Mặc dù lực lượng cách mạng là toàn dân, Hồ Chí Minh đặc biệt nhấn mạnh:</p>
              <div class="strat-quote-box">
                <div class="strat-quote-text">“Công nông là người chủ cách mệnh... là gốc cách mệnh.”</div>
                <div class="strat-quote-author">— HỒ CHÍ MINH</div>
              </div>
              <strong style="font-size: 13px; color: #065F46; display: block; margin-top: 6px;">VÌ SAO CÔNG – NÔNG LÀ GỐC?</strong>
              <ul style="margin-top: 4px;">
                <li>Công nhân và nông dân là <strong>lực lượng đông đảo nhất</strong> trong xã hội.</li>
                <li><strong>Bị áp bức, bóc lột nặng nề nhất</strong> dưới ách thực dân - phong kiến.</li>
                <li>Có <strong>tinh thần đấu tranh mạnh mẽ, kiên quyết</strong> và triệt để nhất.</li>
                <li>Có <strong>lợi ích gắn bó sống còn</strong> với sự nghiệp giải phóng dân tộc.</li>
              </ul>
            </div>
          </div>
        `,
        takeaway: "Cách mạng giải phóng dân tộc là sự nghiệp của toàn dân tộc (Tập hợp → Giác ngộ → Tổ chức → Đoàn kết toàn dân), quy tụ mọi lực lượng yêu nước nhưng đặt vững chắc trên nền tảng liên minh Công – Nông làm gốc rễ.",
        speech: "Về lực lượng cách mạng: Bác kế thừa luận điểm Mác – Lênin rằng cách mạng là sự nghiệp của quần chúng nhân dân. Người khẳng định 'Cách mệnh là việc chung cả dân chúng chứ không phải việc một hai người' và 'Có dân là có tất cả'. Vì vậy, cách mạng phải đi qua 4 bước: Tập hợp, Giác ngộ, Tổ chức và Đoàn kết toàn dân. Trong khối toàn dân đó, Bác chỉ rõ 'Công nông là gốc cách mệnh' vì họ đông đảo nhất, bị áp bức bóc lột nặng nề nhất, có tinh thần đấu tranh kiên quyết nhất và có lợi ích gắn bó trực tiếp với sự nghiệp cách mạng."
      }
    },

    3: {
      name: "LÃNH ĐẠO // ĐẢNG CỘNG SẢN VIỆT NAM",
      img: "assets/images/strat3_duongkachmenh.jpg",
      caption: "Tác phẩm Đường Kách Mệnh (1927) — 'Cách mệnh trước hết phải có Đảng cách mệnh để trong thì vận động, ngoài thì liên lạc'",
      q: "Lực lượng chính trị nào giữ vai trò tổ chức, lãnh đạo cách mạng giải phóng dân tộc Việt Nam?",
      options: [
        { key: "A", text: "Đảng Cộng sản Việt Nam — đội tiên phong của giai cấp công nhân, nhân dân lao động và dân tộc Việt Nam", correct: true },
        { key: "B", text: "Một mặt trận dân chủ do các tầng lớp tư sản và tiểu tư sản trí thức thay nhau điều hành" },
        { key: "C", text: "Phong trào tự phát của quần chúng nhân dân không cần đến một chính đảng lãnh đạo" }
      ],
      summary: "Lãnh đạo: Đảng Cộng sản Việt Nam — Đội tiền phong giác ngộ và tổ chức quần chúng",
      lesson: {
        badge: "BÀI HỌC CỐT LÕI // 1 TRANG TOÀN DIỆN",
        title: "Vai trò tổ chức, lãnh đạo của Đảng & Bản chất sáng tạo của Đảng ở Việt Nam",
        html: `
          <div class="strat-grid-2col">
            <!-- CỘT 1: VAI TRÒ SỐNG CÒN CỦA ĐẢNG THEO MÁC-LÊNIN & HỒ CHÍ MINH -->
            <div class="strat-card-box soft-blue">
              <h4>1. THEO CHỦ NGHĨA MÁC – LÊNIN</h4>
              <p>Giai cấp công nhân muốn hoàn thành sứ mệnh lịch sử cần có <strong>một chính đảng cách mạng</strong>. Đảng có nhiệm vụ thực hiện quy trình lãnh đạo khoa học:</p>
              <div class="strat-flow-pills" style="margin: 8px 0;">
                <span class="strat-flow-node">GIÁC NGỘ</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">TẬP HỢP</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">TỔ CHỨC</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">HUẤN LUYỆN</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node highlight">ĐƯA ĐẤU TRANH</span>
              </div>

              <h4>2. HỒ CHÍ MINH VẬN DỤNG VÀO VIỆT NAM</h4>
              <p>Trong tác phẩm <em>Đường Kách Mệnh</em> (1927), Người đặt câu hỏi cốt tử: <strong>“Cách mệnh trước hết phải có cái gì?”</strong> Và trả lời: <strong>“Trước hết phải có đảng cách mệnh...”</strong></p>
              <div class="strat-quote-box green-quote">
                <div class="strat-quote-text">“Đảng có vững cách mệnh mới thành công, cũng như người cầm lái có vững thuyền mới chạy.”</div>
                <div class="strat-quote-author">— HỒ CHÍ MINH (1927)</div>
              </div>
              <p style="font-size: 13px; line-height: 1.5; margin-top: 6px;"><strong>Vai trò của Đảng:</strong> Đảng không thay thế quần chúng tiến hành cách mạng, mà Đảng <em>tổ chức + giác ngộ + lãnh đạo + phát huy sức mạnh của quần chúng</em>.</p>
            </div>

            <!-- CỘT 2: ĐIỂM SÁNG TẠO ĐẶC BIỆT CỦA ĐẢNG TẠI VIỆT NAM -->
            <div class="strat-card-box soft-amber">
              <h4>3. BẢN CHẤT SÁNG TẠO CỦA ĐẢNG Ở VIỆT NAM</h4>
              <p>Trong điều kiện Việt Nam là một nước thuộc địa phong kiến, Hồ Chí Minh phát triển quan niệm sáng tạo về Đảng:</p>
              <ul style="margin-bottom: 10px;">
                <li><strong>① Là đội tiên phong của giai cấp công nhân:</strong> Mang bản chất của giai cấp công nhân.</li>
                <li><strong>② Đồng thời là đội tiên phong của nhân dân lao động:</strong> Gắn bó mật thiết với lợi ích của nhân dân.</li>
                <li><strong>③ Gắn bó với toàn thể dân tộc:</strong> Đặt lợi ích của dân tộc và sự nghiệp giải phóng dân tộc ở vị trí quan trọng.</li>
              </ul>

              <h4>4. ĐIỂM ĐẶC BIỆT — ĐẠI HỘI II CỦA ĐẢNG (1951)</h4>
              <p>Tại Đại hội đại biểu toàn quốc lần thứ II của Đảng (1951), Hồ Chí Minh khẳng định luận điểm bất hủ:</p>
              <div class="strat-quote-box">
                <div class="strat-quote-text">“Đảng Lao động Việt Nam là đảng của giai cấp công nhân và nhân dân lao động, cho nên nó phải là đảng của dân tộc Việt Nam.”</div>
                <div class="strat-quote-author">— BÁO CÁO CHÍNH TRỊ TẠI ĐẠI HỘI II (1951)</div>
              </div>
            </div>
          </div>
        `,
        takeaway: "Quần chúng là chủ thể của cách mạng. Đảng Cộng sản Việt Nam là lực lượng lãnh đạo, tổ chức và định hướng cách mạng — vừa là đảng của giai cấp công nhân, nhân dân lao động, vừa là đảng của toàn thể dân tộc Việt Nam.",
        speech: "Về lực lượng lãnh đạo: Bác khẳng định theo lý luận Mác - Lênin, phong trào cách mạng muốn thắng lợi thì trước hết phải có một chính đảng cách mạng để giác ngộ, tập hợp, tổ chức, huấn luyện và đưa quần chúng đấu tranh. Trong 'Đường Kách Mệnh' (1927), Bác ví Đảng như người cầm lái có vững thuyền mới chạy. Đảng không thay thế quần chúng mà lãnh đạo và phát huy sức mạnh quần chúng. Đặc biệt, xuất phát từ một nước thuộc địa phong kiến, Bác sáng tạo chỉ rõ: Đảng ta không chỉ là đội tiên phong của giai cấp công nhân mà còn là của nhân dân lao động và của toàn thể dân tộc Việt Nam, như lời khẳng định tại Đại hội II năm 1951."
      }
    },

    4: {
      name: "PHƯƠNG PHÁP // BẠO LỰC CÁCH MẠNG",
      img: "assets/images/strat4_vnttgpq.jpg",
      caption: "Đội Việt Nam Tuyên truyền Giải phóng quân (1944) — Bạo lực cách mạng kết hợp đấu tranh chính trị và vũ trang",
      q: "Phương pháp chủ yếu để đập tan bạo lực phản cách mạng của thực dân, giành lấy và bảo vệ chính quyền?",
      options: [
        { key: "A", text: "Kêu gọi lòng nhân đạo của chính quyền thực dân và chỉ sử dụng đấu tranh nghị trường" },
        { key: "B", text: "Sử dụng bạo lực cách mạng: Kết hợp chặt chẽ giữa đấu tranh chính trị và đấu tranh vũ trang", correct: true },
        { key: "C", text: "Sử dụng phương pháp khủng bố cá nhân đơn lẻ để tiêu diệt các quan chức thực dân" }
      ],
      summary: "Phương pháp: Bạo lực cách mạng — Kết hợp chặt chẽ đấu tranh chính trị và vũ trang",
      lesson: {
        badge: "BÀI HỌC CỐT LÕI // 1 TRANG TOÀN DIỆN",
        title: "Tính tất yếu của Bạo lực cách mạng & Bảng đối chiếu Hai lực lượng, Hai hình thức đấu tranh",
        html: `
          <!-- KHỐI 1: CƠ SỞ LÝ LUẬN & TÍNH TẤT YẾU TẠI VIỆT NAM -->
          <div class="strat-grid-2col" style="margin-bottom: 12px;">
            <div class="strat-card-box soft-blue">
              <h4>1. CƠ SỞ LÝ LUẬN MÁC – LÊNIN</h4>
              <p style="margin: 0; line-height: 1.55;">C. Mác và Ph. Ăngghen chỉ ra vai trò của <strong>bạo lực cách mạng</strong> trong việc phá bỏ chế độ cũ và mở đường cho chế độ mới. V.I. Lênin phát triển quan điểm này và khẳng định tính tất yếu của bạo lực cách mạng trong cách mạng vô sản.</p>
            </div>

            <div class="strat-card-box soft-amber">
              <h4>2. HỒ CHÍ MINH VẬN DỤNG VÀO VIỆT NAM</h4>
              <p style="font-size: 13px; margin-bottom: 6px;">Thực dân, đế quốc sử dụng quân sự, đàn áp, bóc lột, khủng bố, tước đoạt quyền tự do, dân chủ để duy trì thuộc địa. Hồ Chí Minh nhận định:</p>
              <div class="strat-quote-box" style="margin-bottom: 6px;">
                <div class="strat-quote-text">“Bản thân chế độ thực dân đã là một hình thức bạo lực của kẻ mạnh đối với kẻ yếu.”</div>
              </div>
              <p style="font-size: 13px; margin: 0;">Vì vậy Người khẳng định: <strong>“Cần dùng bạo lực cách mạng chống lại bạo lực phản cách mạng, giành lấy chính quyền và bảo vệ chính quyền.”</strong></p>
            </div>
          </div>

          <!-- KHỐI 2: BẢNG ĐỐI CHIẾU HAI LỰC LƯỢNG & HAI HÌNH THỨC -->
          <div class="strat-card-box soft-green">
            <h4 style="margin-bottom: 8px;">3. HAI LỰC LƯỢNG VÀ HAI HÌNH THỨC ĐẤU TRANH CHỦ YẾU</h4>
            <p style="font-size: 13px; margin-bottom: 10px;">Theo Hồ Chí Minh, bạo lực cách mạng được thực hiện thông qua hai lực lượng và hai hình thức đấu tranh phối hợp hữu cơ:</p>
            
            <table class="strat-table">
              <thead>
                <tr>
                  <th style="width: 22%;">LỰC LƯỢNG</th>
                  <th style="width: 26%;">HÌNH THỨC</th>
                  <th style="width: 52%;">VAI TRÒ VÀ Ý NGHĨA CỐT LÕI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Lực lượng chính trị</strong></td>
                  <td><strong>Đấu tranh chính trị</strong> (quần chúng nhân dân)</td>
                  <td>
                    • Giác ngộ và tập hợp nhân dân, tạo sức mạnh chính trị.<br>
                    • Mở rộng phong trào, xây dựng cơ sở và lực lượng cách mạng.<br>
                    • <strong>Là cơ sở, nền tảng vững chắc cho việc xây dựng lực lượng vũ trang.</strong>
                  </td>
                </tr>
                <tr>
                  <td><strong>Lực lượng vũ trang</strong></td>
                  <td><strong>Đấu tranh vũ trang</strong> (quân đội, dân quân du kích)</td>
                  <td>
                    • Tiêu diệt lực lượng quân sự của đối phương, làm thất bại âm mưu thôn tính.<br>
                    • Che chở, mở đường cho phong trào chính trị quần chúng.<br>
                    • <strong>Góp phần quyết định trong việc kết thúc chiến tranh.</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
        takeaway: "Bạo lực cách mạng theo tư tưởng Hồ Chí Minh là bạo lực của quần chúng nhân dân, dùng bạo lực cách mạng đập tan bạo lực phản cách mạng; kết hợp chặt chẽ giữa đấu tranh chính trị làm nền tảng với đấu tranh vũ trang giữ vai trò quyết định.",
        speech: "Về phương pháp cách mạng: C. Mác, Ăngghen và Lênin đều chỉ rõ vai trò tất yếu của bạo lực cách mạng. Tại Việt Nam, thực dân Pháp duy trì ách thống trị bằng đàn áp quân sự và khủng bố. Bác nhận định 'Bản thân chế độ thực dân đã là một hình thức bạo lực của kẻ mạnh đối với kẻ yếu'. Do đó, Người khẳng định dứt khoát phải dùng bạo lực cách mạng chống lại bạo lực phản cách mạng. Bạo lực cách mạng được Bác triển khai qua 2 lực lượng và 2 hình thức: Đấu tranh chính trị của quần chúng là cơ sở nền tảng, và Đấu tranh vũ trang giữ vai trò quyết định kết thúc chiến tranh."
      }
    },

    5: {
      name: "TÍNH CHỦ ĐỘNG // KHẢ NĂNG THẮNG TRƯỚC",
      img: "assets/images/strat5_leparia.jpg",
      caption: "Báo Le Paria (Người cùng khổ - 1922) — Luận điểm sáng tạo: Cách mạng thuộc địa có thể chủ động thắng trước chính quốc",
      q: "Cách mạng giải phóng dân tộc ở thuộc địa có mối quan hệ như thế nào với cách mạng vô sản ở chính quốc?",
      options: [
        { key: "A", text: "Phụ thuộc hoàn toàn vào chính quốc, chỉ có thể nổ ra và thắng lợi sau khi chính quốc đã thành công" },
        { key: "B", text: "Là phong trào độc lập hoàn toàn, không có liên hệ hay tác động gì tới cách mạng vô sản ở chính quốc" },
        { key: "C", text: "Quan hệ chặt chẽ, tác động qua lại, không lệ thuộc và có khả năng chủ động giành thắng lợi trước chính quốc", correct: true }
      ],
      summary: "Tính chủ động: Hình tượng con đỉa hai vòi — Khả năng chủ động giành thắng lợi trước chính quốc",
      lesson: {
        badge: "BÀI HỌC CỐT LÕI // 1 TRANG TOÀN DIỆN",
        title: "Tính chủ động của Cách mạng thuộc địa & Luận điểm hình tượng 'Con rắn hai vòi'",
        html: `
          <!-- HÀNG 1: ĐỘT PHÁ LÝ LUẬN VỀ TÍNH CHỦ ĐỘNG -->
          <div class="strat-grid-2col" style="margin-bottom: 12px;">
            <div class="strat-card-box soft-amber">
              <h4>1. QUAN ĐIỂM TỪNG TỒN TẠI</h4>
              <p>Do chưa đánh giá đầy đủ tiềm lực của cách mạng thuộc địa, có lúc Quốc tế Cộng sản cho rằng:</p>
              <div class="strat-quote-box">
                <div class="strat-quote-text">“Cách mạng thuộc địa phải phụ thuộc vào thắng lợi của cách mạng vô sản ở chính quốc.”</div>
              </div>
              <p style="font-size: 13px; margin: 0; color: #7F1D1D;"><strong>Hậu quả:</strong> Quan điểm này dẫn đến tư tưởng thụ động: <em>Chính quốc chưa thắng → Thuộc địa chưa thể giải phóng</em>, làm giảm tính chủ động của các dân tộc thuộc địa.</p>
            </div>

            <div class="strat-card-box soft-green">
              <h4>2. QUAN ĐIỂM ĐỘT PHÁ CỦA HỒ CHÍ MINH</h4>
              <p>Hồ Chí Minh nhìn nhận: Cách mạng thuộc địa và cách mạng vô sản ở chính quốc có mối quan hệ biện chứng:</p>
              <div class="strat-flow-pills" style="margin: 6px 0;">
                <span class="strat-flow-node">QUAN HỆ CHẶT CHẼ</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node">TÁC ĐỘNG QUA LẠI</span>
                <span class="strat-flow-arrow">➔</span>
                <span class="strat-flow-node highlight">HỖ TRỢ LẪN NHAU</span>
              </div>
              <ul style="margin: 0;">
                <li>Nhưng: <strong>Không phải quan hệ lệ thuộc, phụ thuộc một chiều.</strong></li>
                <li>Do đó: <strong>Cách mạng thuộc địa có khả năng chủ động giành thắng lợi.</strong></li>
                <li>Thậm chí: <strong>Có thể giành thắng lợi trước cách mạng vô sản ở chính quốc.</strong></li>
              </ul>
            </div>
          </div>

          <!-- HÀNG 2: HÌNH TƯỢNG CON RẮN HAI VÒI -->
          <div class="strat-card-box soft-blue">
            <h4>3. HÌNH TƯỢNG KINH ĐIỂN CỦA HỒ CHÍ MINH: "CON RẮN / CON ĐỈA HAI VÒI"</h4>
            <p style="font-size: 13px; margin-bottom: 10px;">Hồ Chí Minh ví chủ nghĩa tư bản như một con rắn (con đỉa) có hai vòi:</p>
            
            <div class="strat-leech-grid">
              <div class="leech-wing-box">
                <span class="leech-wing-tag">VÒI 1: CHÍNH QUỐC</span>
                <p style="font-size: 13px; margin: 0; line-height: 1.45;">Bám vào giai cấp vô sản và nhân dân lao động ở chính quốc để bóc lột giá trị thặng dư.</p>
              </div>

              <div class="leech-center">
                <div class="leech-center-badge">CHỦ NGHĨA ĐẾ QUỐC</div>
                <small style="font-size: 11px; color: #7F1D1D; font-weight: 700;">(Con rắn có hai vòi)</small>
              </div>

              <div class="leech-wing-box highlight">
                <span class="leech-wing-tag">VÒI 2: THUỘC ĐỊA</span>
                <p style="font-size: 13px; margin: 0; line-height: 1.45;">Bám vào các dân tộc thuộc địa để vơ vét tài nguyên và bóc lột nhân công rẻ mạt.</p>
              </div>
            </div>

            <div class="strat-quote-box green-quote" style="margin-top: 10px;">
              <div class="strat-quote-text">“Muốn tiêu diệt chủ nghĩa đế quốc không thể chỉ tập trung vào một phía, phải chặt đứt cả hai vòi. Cách mạng thuộc địa có vai trò rất quan trọng trong việc cùng cách mạng ở chính quốc đánh đổ chủ nghĩa đế quốc.”</div>
              <div class="strat-quote-author">— HỒ CHÍ MINH (BÁO LE PARIA)</div>
            </div>
          </div>
        `,
        takeaway: "Cách mạng giải phóng dân tộc ở thuộc địa không thụ động chờ đợi chính quốc mà hoàn toàn có khả năng chủ động đứng lên giành thắng lợi trước, đồng thời giúp đỡ cách mạng vô sản ở chính quốc cùng đánh đổ chủ nghĩa đế quốc.",
        speech: "Quyết sách thứ năm là sáng tạo lý luận độc đáo bậc nhất của Bác. Trước đây Quốc tế Cộng sản từng cho rằng thuộc địa phải phụ thuộc vào thắng lợi của chính quốc, dễ gây tư tưởng thụ động chờ đợi. Bác Hồ khẳng định hai cuộc cách mạng có quan hệ chặt chẽ, tác động qua lại, hỗ trợ lẫn nhau nhưng không lệ thuộc. Thuộc địa hoàn toàn có thể chủ động giành thắng lợi trước. Bác ví chủ nghĩa tư bản như con rắn có hai vòi: một vòi ở chính quốc, một vòi ở thuộc địa. Muốn tiêu diệt đế quốc thì không thể chỉ đánh một phía mà phải chặt cả hai vòi. Thực tiễn thắng lợi của Cách mạng Tháng Tám năm 1945 tại Việt Nam đã chứng minh tính tiên tri thiên tài của Bác."
      }
    }
  };

  // --- DỮ LIỆU CHẶNG 4: 4 BÀI TOÁN THỰC TIỄN VIỆT NAM (TÂN - 3.2.2) ---
  const CHALLENGES = {
    1: {
      badge: "THỬ THÁCH 01 // BỐI CẢNH LỊCH SỬ",
      img: "assets/images/ch1_nongnghiep.jpg",
      caption: "Nông thôn miền Bắc thời kỳ đầu khôi phục kinh tế — Xuất phát điểm nông nghiệp lạc hậu tiến thẳng lên CNXH",
      title: "Đặc điểm lớn nhất của thời kỳ quá độ lên CNXH ở Việt Nam?",
      desc: "Việt Nam bước vào thời kỳ quá độ lên CNXH từ một nền kinh tế nông nghiệp lạc hậu, cơ sở vật chất và lực lượng sản xuất còn hạn chế.",
      options: [
        { key: "A", text: "Từ một nước nông nghiệp lạc hậu tiến thẳng lên CNXH, bỏ qua giai đoạn phát triển tư bản chủ nghĩa.", correct: true },
        { key: "B", text: "Đã có sẵn nền đại công nghiệp phát triển và cơ sở vật chất kỹ thuật dồi dào từ trước." },
        { key: "C", text: "Chỉ cần sao chép y nguyên lộ trình của các quốc gia công nghiệp phát triển ở châu Âu." }
      ],
      chot: "Xuất phát điểm thấp → không thể áp dụng máy móc mô hình nước khác → phải có bước đi phù hợp với Việt Nam.",
      speech: "Ở câu đầu tiên, chúng ta cần xác định điểm xuất phát của Việt Nam. Việt Nam bước vào thời kỳ quá độ lên CNXH từ một nền kinh tế nông nghiệp lạc hậu, cơ sở vật chất và lực lượng sản xuất còn hạn chế. Vì vậy, điểm đặc biệt là Việt Nam tiến lên CNXH, bỏ qua chế độ tư bản chủ nghĩa, chứ không có sẵn nền đại công nghiệp như một số nước phát triển. Điều này tạo ra một bài toán rất lớn: nếu xuất phát điểm còn thấp thì Việt Nam phải lựa chọn bước đi như thế nào để vừa phát triển kinh tế, vừa xây dựng CNXH?"
    },
    2: {
      badge: "THỬ THÁCH 02 // NÔNG NGHIỆP & CÔNG NGHIỆP",
      img: "assets/images/ch2_cong_nong.jpg",
      caption: "Liên minh công nông sản xuất — Nông nghiệp là nền tảng, công nghiệp là động lực hỗ trợ nhau",
      title: "Xử lý mối quan hệ giữa nông nghiệp và công nghiệp ra sao?",
      desc: "Sau khi xác định Việt Nam là một nước nông nghiệp, bài toán đặt ra: Chúng ta có nên bỏ nông nghiệp để tập trung ngay vào công nghiệp nặng không?",
      options: [
        { key: "A", text: "Tập trung toàn lực phát triển công nghiệp nặng ngay lập tức, xem nhẹ vai trò của nông thôn." },
        { key: "B", text: "Chỉ phát triển thương mại dịch vụ tiêu dùng đơn thuần, tách rời nông nghiệp và công nghiệp." },
        { key: "C", text: "Lấy nông nghiệp làm mặt trận hàng đầu, phục vụ đời sống dân sinh và làm tiền đề phát triển công nghiệp.", correct: true }
      ],
      chot: "Nông nghiệp là nền tảng, công nghiệp là động lực; hai bên phải hỗ trợ nhau.",
      speech: "Sau khi xác định Việt Nam là một nước nông nghiệp, câu hỏi tiếp theo là: chúng ta có nên bỏ nông nghiệp để tập trung ngay vào công nghiệp nặng không? Theo tư tưởng Hồ Chí Minh, câu trả lời là không. Người xác định nông nghiệp là mặt trận hàng đầu, đồng thời nhấn mạnh mối quan hệ giữa nông nghiệp và công nghiệp. Nông nghiệp vừa bảo đảm đời sống nhân dân, vừa cung cấp nguyên liệu và tạo cơ sở cho công nghiệp phát triển. Vì vậy, hai lĩnh vực này không tách rời mà phải hỗ trợ lẫn nhau, trong đó phát triển nông nghiệp là cơ sở quan trọng để thúc đẩy công nghiệp."
    },
    3: {
      badge: "THỬ THÁCH 03 // ĐỘNG LỰC CON NGƯỜI",
      img: "assets/images/ch3_dongluc.jpg",
      caption: "Phong trào thi đua yêu nước — Nhân dân vừa là mục tiêu, vừa là động lực của công cuộc xây dựng CNXH",
      title: "Đâu là động lực quyết định thúc đẩy nhân dân thi đua xây dựng?",
      desc: "Có chính sách đúng thôi chưa đủ. Muốn xây dựng đất nước thì nhân dân vừa là mục tiêu, vừa là động lực của công cuộc xây dựng CNXH.",
      options: [
        { key: "A", text: "Chỉ áp dụng mệnh lệnh hành chính ép buộc, kỷ luật thép và xử phạt nghiêm ngặt." },
        { key: "B", text: "Kết hợp hài hòa giữa lợi ích tập thể và lợi ích thiết thực của người lao động; phát huy quyền làm chủ của nhân dân.", correct: true },
        { key: "C", text: "Trông chờ hoàn toàn vào sự chi viện từ bên ngoài mà không cần phát huy nội lực nhân dân." }
      ],
      chot: "Muốn dân làm → phải để dân làm chủ và thấy được lợi ích thiết thực.",
      speech: "Nhưng có chính sách đúng thôi thì chưa đủ. Muốn xây dựng đất nước thì phải có con người tham gia. Theo Hồ Chí Minh, nhân dân vừa là mục tiêu, vừa là động lực của công cuộc xây dựng CNXH. Điều đó có nghĩa là xây dựng CNXH cuối cùng phải hướng tới việc nâng cao đời sống của nhân dân. Đồng thời, chính nhân dân là lực lượng trực tiếp tham gia xây dựng đất nước. Vì vậy, không thể chỉ dùng mệnh lệnh hay ép buộc. Phải phát huy quyền làm chủ và quan tâm đến lợi ích thiết thực của người lao động. Khi người dân thấy được lợi ích của mình gắn với lợi ích chung, họ sẽ có động lực tham gia và đóng góp."
    },
    4: {
      badge: "THỬ THÁCH 04 // PHƯƠNG CHÂM & BÀI HỌC",
      img: "assets/images/ch4_tietkiem.jpg",
      caption: "Chủ tịch Hồ Chí Minh bên bàn làm việc — Mẫu mực về cần kiệm liêm chính, kiên quyết chống 'giặc nội xâm'",
      title: "Để bảo vệ thành quả cách mạng và giữ vững niềm tin của nhân dân đối với chế độ mới, cần phương châm nào?",
      desc: "Đây là câu quan trọng nhất, vì nó tổng hợp những bài toán trước: Xây dựng CNXH gắn liền với xây dựng bộ máy trong sạch.",
      options: [
        { key: "A", text: "Tiến dần từng bước vững chắc; kiên quyết chống tham ô, lãng phí, quan liêu – thứ “giặc nội xâm” nguy hiểm.", correct: true },
        { key: "B", text: "Chủ quan nóng vội, đốt cháy giai đoạn; chỉ lo tăng trưởng kinh tế bề nổi mà xem nhẹ xây dựng bộ máy trong sạch." },
        { key: "C", text: "Thỏa hiệp, che giấu các biểu hiện quan liêu tiêu cực và thói đặc quyền đặc lợi trong bộ máy." }
      ],
      chot: "Xây dựng phải từng bước; quản lý phải trong sạch; nhân dân phải có niềm tin.",
      speech: "Qua ba thử thách trước, chúng ta đã thấy Việt Nam có xuất phát điểm thấp, phải phát triển phù hợp với thực tế và đặc biệt phải phát huy vai trò của nhân dân. Vậy quá trình đó phải diễn ra như thế nào? Hồ Chí Minh nhấn mạnh phải tiến dần từng bước, vững chắc, không chủ quan nóng vội. Đồng thời, Người đặc biệt quan tâm đến việc chống tham ô, lãng phí và quan liêu. Người coi đây là những thứ có thể làm suy yếu bộ máy, làm thất thoát nguồn lực và ảnh hưởng đến niềm tin của nhân dân. Vì vậy, xây dựng CNXH không chỉ là phát triển kinh tế mà còn phải xây dựng một bộ máy trong sạch, phát huy đạo đức của cán bộ và giữ vững niềm tin của nhân dân."
    }
  };

  // --- DỮ LIỆU SLIDE 11: GHÉP NỐI MẠCH BIỆN CHỨNG ---
  const CHAIN_CARDS = [
    {
      id: "c-321",
      targetSlot: 3,
      title: "CHỦ NGHĨA XÃ HỘI",
      img: "assets/images/pillar_eco_nhamay.jpg?v=4",
      role: "Mục tiêu lý tưởng & Đích đến bảo vệ độc lập"
    },
    {
      id: "c-311",
      targetSlot: 1,
      title: "ĐỘC LẬP DÂN TỘC",
      img: "assets/images/hotspot1_1919.jpg?v=4",
      role: "Tiền đề xuất phát & Quyền thiêng liêng"
    },
    {
      id: "c-322",
      targetSlot: 4,
      title: "XÂY DỰNG TẠI VN",
      img: "assets/images/ch2_cong_nong.jpg?v=4",
      role: "Vận dụng thực tiễn & Bước đi thận trọng"
    },
    {
      id: "c-312",
      targetSlot: 2,
      title: "CÁCH MẠNG GPDT",
      img: "assets/images/strat4_vnttgpq.jpg",
      role: "Con đường vô sản & Bạo lực cách mạng"
    }
  ];

  // --- DỮ LIỆU 8 CÂU HỎI SẮP XẾP TỪ (MINI GAME 4 NHÓM) ---
  const MINIGAME_QUESTIONS = [
    {
      id: 1,
      topic: "Độc lập dân tộc (Chánh cương vắn tắt 1930)",
      prompt: "Theo Chánh cương vắn tắt năm 1930, mục tiêu chính trị nào thể hiện trực tiếp nhiệm vụ giải phóng dân tộc?",
      words: ["cho", "được", "Nam", "hoàn toàn", "nước", "làm", "độc lập"],
      answer: "Làm cho nước Nam được hoàn toàn độc lập.",
      hint: "Bắt đầu bằng từ hành động: 'Làm cho...'"
    },
    {
      id: 2,
      topic: "Chân lý độc lập tự do",
      prompt: "Hãy hoàn thành chân lý nổi tiếng của Hồ Chí Minh về giá trị của độc lập dân tộc.",
      words: ["hơn", "gì", "tự", "không", "độc", "có", "lập", "do", "quý"],
      answer: "Không có gì quý hơn độc lập, tự do.",
      hint: "Lời kêu gọi chống Mỹ cứu nước ngày 17/7/1966"
    },
    {
      id: 3,
      topic: "Bản chất nền độc lập chân chính",
      prompt: "Nền độc lập mà Hồ Chí Minh hướng tới phải khác với thứ “độc lập tự do” giả hiệu của chủ nghĩa thực dân ở điểm nào?",
      words: ["triệt", "hoàn", "thực", "và", "toàn", "sự", "để"],
      answer: "Thực sự, hoàn toàn và triệt để.",
      hint: "Ba tính từ khẳng định tính triệt để của độc lập"
    },
    {
      id: 4,
      topic: "Chăm lo đời sống nhân dân sau Cách mạng Tháng Tám",
      prompt: "Sau Cách mạng tháng Tám, Hồ Chí Minh đặt ra những yêu cầu thiết thực nào để bảo đảm đời sống nhân dân?",
      words: ["có chỗ ở", "cho dân", "học hành", "có ăn", "làm cho dân", "có mặc", "làm cho dân", "làm cho dân", "làm cho dân"],
      answer: "Làm cho dân có ăn, làm cho dân có mặc, làm cho dân có chỗ ở, làm cho dân có học hành.",
      hint: "Bốn nhu cầu thiết yếu: Ăn, Mặc, Ở, Học"
    },
    {
      id: 5,
      topic: "Độc lập gắn liền thống nhất & toàn vẹn lãnh thổ",
      prompt: "Tư tưởng xuyên suốt của Hồ Chí Minh về độc lập dân tộc và lãnh thổ là gì?",
      words: ["với", "độc lập dân tộc", "thống nhất", "gắn liền", "toàn vẹn lãnh thổ", "và"],
      answer: "Độc lập dân tộc gắn liền với thống nhất và toàn vẹn lãnh thổ.",
      hint: "'Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi'"
    },
    {
      id: 6,
      topic: "Mục tiêu xây dựng Chủ nghĩa xã hội",
      prompt: "Hãy sắp xếp các từ sau để hoàn thành quan điểm của Hồ Chí Minh về mục tiêu xây dựng chủ nghĩa xã hội.",
      words: ["mạnh", "nước", "dân", "giàu", "xã hội", "chủ nghĩa"],
      answer: "Dân giàu, nước mạnh, xã hội chủ nghĩa.",
      hint: "Bắt đầu bằng yếu tố 'Dân...'"
    },
    {
      id: 7,
      topic: "Bản chất của Chủ nghĩa xã hội",
      prompt: "Hãy sắp xếp các từ sau để hoàn thành quan điểm của Hồ Chí Minh về bản chất của chủ nghĩa xã hội.",
      words: ["ấm no", "nhân dân", "được", "hạnh phúc", "có", "tự do"],
      answer: "Nhân dân được ấm no, hạnh phúc, có tự do.",
      hint: "Chủ nghĩa xã hội là làm sao cho nhân dân..."
    },
    {
      id: 8,
      topic: "Động lực xây dựng Chủ nghĩa xã hội",
      prompt: "Hãy sắp xếp các từ sau để thể hiện quan điểm của Hồ Chí Minh về động lực xây dựng chủ nghĩa xã hội.",
      words: ["nhân dân", "là", "động lực", "chủ yếu", "của", "cách mạng"],
      answer: "Nhân dân là động lực chủ yếu của cách mạng.",
      hint: "Sức mạnh vô địch thuộc về ai?"
    }
  ];

  // --- CONTROLLER ĐIỀU KHIỂN GIAO DIỆN & TƯƠNG TÁC ---
  return {
    init() {
      this.bindKeyboard();
      this.bindControls();
      this.initLevel3Inputs();
      this.renderChallengeStage(1);
      this.renderChainPool();
      this.initMiniGame();

      // Hỗ trợ nhảy trực tiếp tới slide qua URL hash (ví dụ: #slide-13)
      const hash = window.location.hash;
      let startSlide = 0;
      if (hash && hash.startsWith('#slide-')) {
        const parsed = parseInt(hash.replace('#slide-', ''), 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < State.totalSlides) {
          startSlide = parsed;
        }
      }
      this.goToSlide(startSlide);

      // Hỗ trợ tham số URL nhảy thẳng vào thử thách của Tân (ví dụ: ?ch=2 hoặc ?ch=1&ans=1)
      const urlParams = new URLSearchParams(window.location.search);
      const chParam = parseInt(urlParams.get('ch'), 10);
      if (chParam >= 1 && chParam <= 4) {
        this.renderChallengeStage(chParam);
        if (urlParams.get('ans')) {
          setTimeout(() => {
            const data = CHALLENGES[chParam];
            const btns = document.querySelectorAll('.stage-opt-btn');
            data.options.forEach((o, idx) => {
              if (o.correct && btns[idx]) btns[idx].click();
            });
          }, 80);
        }
      }

      // Hỗ trợ mở trực tiếp Điểm tư liệu qua URL (ví dụ: ?hotspot=4&seek=50)
      const hpParam = parseInt(urlParams.get('hotspot'), 10);
      if (hpParam >= 1 && hpParam <= 4) {
        this.goToSlide(2);
        setTimeout(() => {
          this.openHotspot(hpParam);
          const seekParam = parseFloat(urlParams.get('seek'));
          if (!isNaN(seekParam) && seekParam > 0) {
            setTimeout(() => {
              const vid = document.getElementById('hotspot-video-player');
              if (vid) {
                const applySeek = () => {
                  vid.currentTime = seekParam;
                  this.updateVideoProgress('hotspot-video-player');
                  const statusEl = document.getElementById('video-status-text');
                  if (statusEl) statusEl.textContent = `Đang ở đoạn ${this.formatTime(seekParam)} / ${this.formatTime(vid.duration || 112.5)}`;
                };
                if (vid.readyState >= 1) {
                  applySeek();
                } else {
                  vid.addEventListener('loadedmetadata', applySeek, { once: true });
                }
              }
            }, 80);
          }
        }, 120);
      }
    },

    // Chuyển Slide
    goToSlide(index) {
      if (index < 0 || index >= State.totalSlides) return;
      AudioFX.click();

      // Dừng phát mọi video khi chuyển slide
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach(v => {
        if (!v.paused) v.pause();
      });

      // Cập nhật hash trên thanh địa chỉ URL
      if (window.location.hash !== `#slide-${index}`) {
        history.replaceState(null, null, `#slide-${index}`);
      }

      // Hủy kích hoạt slide cũ
      const oldSlide = document.querySelector('.slide-view.active');
      if (oldSlide) oldSlide.classList.remove('active');

      // Kích hoạt slide mới
      State.currentSlide = index;
      const newSlide = document.getElementById(`slide-${index}`);
      if (newSlide) newSlide.classList.add('active');

      // Tôn vinh hình ảnh Bác Hồ: Khi ở trang bìa hiển thị nền rõ nét, các trang sau chuyển mờ nhẹ
      if (index === 0) {
        document.body.classList.add('slide-0-active');
      } else {
        document.body.classList.remove('slide-0-active');
      }

      // Cập nhật số trang hiển thị
      const counterEl = document.getElementById('slide-counter-text');
      if (counterEl) {
        counterEl.textContent = `Trang ${index + 1} / ${State.totalSlides}`;
      }

      // Cập nhật thanh bước nhảy nhanh
      const pills = document.querySelectorAll('.step-pill');
      pills.forEach((p, idx) => {
        const slideMap = [0, 2, 4, 6, 8, 10, 11, 12, 13, 14];
        if (slideMap[idx] === index || (idx > 0 && index >= slideMap[idx] && (idx === slideMap.length - 1 || index < slideMap[idx + 1]))) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // Tự động render thử thách khi vào Slide 8
      if (index === 8) {
        this.renderChallengeStage(State.lv4.currentIdx || 1);
      }

      // Tự động render Mini Game khi vào Slide 12
      if (index === 12) {
        this.renderMiniGameBoard();
      }
    },

    nextSlide() {
      if (State.currentSlide < State.totalSlides - 1) {
        this.goToSlide(State.currentSlide + 1);
      }
    },

    prevSlide() {
      if (State.currentSlide > 0) {
        this.goToSlide(State.currentSlide - 1);
      }
    },

    // Phím tắt bàn phím
    bindKeyboard() {
      window.addEventListener('keydown', (e) => {
        const isModalOpen = (document.getElementById('lv1-modal') && document.getElementById('lv1-modal').style.display !== 'none') ||
                            (document.getElementById('lv2-modal') && document.getElementById('lv2-modal').style.display !== 'none');
        
        if (e.key === 'Escape') {
          this.closeModal('lv1-modal');
          this.closeModal('lv2-modal');
          this.closeMiniGameQuizModal();
          this.closeModal('minigame-momo-config-modal');
          this.closeModal('minigame-momo-reward-modal');
          return;
        }

        if (isModalOpen) {
          const vid = document.getElementById('hotspot-video-player');
          if (vid) {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              Deck.seekVideo('hotspot-video-player', -5);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              Deck.seekVideo('hotspot-video-player', 5);
            } else if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
              e.preventDefault();
              Deck.toggleVideoPlay('hotspot-video-player');
            }
          }
          return;
        }

        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullscreen();
        }
      });
    },

    bindControls() {
      const startBtn = document.getElementById('btn-start-presentation');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          this.goToSlide(1);
        });
      }
    },

    toggleFullscreen() {
      AudioFX.click();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    },

    // Đóng mở Hộp thoại
    closeModal(id) {
      if (this._autoAdvanceTimer) clearTimeout(this._autoAdvanceTimer);
      AudioFX.click();
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        const vids = el.querySelectorAll('video');
        vids.forEach(v => {
          if (!v.paused) v.pause();
        });
      }
    },

    // Điều khiển video thông minh & Tua video (Seekbar, Controls, Timeline)
    formatTime(sec) {
      if (!sec || isNaN(sec) || sec < 0) return '00:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    },

    toggleVideoPlay(videoId) {
      const vid = document.getElementById(videoId);
      if (!vid) return;
      if (vid.paused) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    },

    seekVideo(videoId, offsetSeconds) {
      AudioFX.click();
      const vid = document.getElementById(videoId);
      if (!vid) return;
      const maxDur = vid.duration && !isNaN(vid.duration) && vid.duration > 0 ? vid.duration : 112.5;
      const target = Math.max(0, Math.min(maxDur, (vid.currentTime || 0) + offsetSeconds));

      const doSeek = () => {
        try {
          vid.currentTime = target;
        } catch (e) {
          console.warn('Seek error:', e);
        }
        const statusEl = document.getElementById('video-status-text');
        if (statusEl) {
          statusEl.textContent = `Đã tua ${offsetSeconds > 0 ? '+' : ''}${offsetSeconds}s (đến ${this.formatTime(target)})`;
        }
        this.updateVideoProgress(videoId);
      };

      if (vid.readyState >= 1) {
        doSeek();
      } else {
        vid.addEventListener('loadedmetadata', doSeek, { once: true });
        if (vid.load) vid.load();
      }
    },

    onVideoSeekInput(videoId, percentVal) {
      const vid = document.getElementById(videoId);
      if (!vid || !vid.duration) return;
      const targetTime = (parseFloat(percentVal) / 100) * vid.duration;
      vid.currentTime = targetTime;
      const currTimeEl = document.getElementById('video-curr-time');
      if (currTimeEl) currTimeEl.textContent = this.formatTime(targetTime);
      const slider = document.getElementById('video-seek-slider');
      if (slider) {
        slider.style.background = `linear-gradient(to right, #38BDF8 0%, #38BDF8 ${percentVal}%, #334155 ${percentVal}%, #334155 100%)`;
      }
      const statusEl = document.getElementById('video-status-text');
      if (statusEl) {
        statusEl.textContent = `Đang kéo tua đến: ${this.formatTime(targetTime)}`;
      }
    },

    onVideoSeekChange(videoId, percentVal) {
      const vid = document.getElementById(videoId);
      if (!vid || !vid.duration) return;
      const targetTime = (parseFloat(percentVal) / 100) * vid.duration;
      vid.currentTime = targetTime;
      const statusEl = document.getElementById('video-status-text');
      if (statusEl) {
        statusEl.textContent = `Đã chuyển đến: ${this.formatTime(targetTime)}`;
      }
    },

    cycleVideoSpeed(videoId) {
      AudioFX.click();
      const vid = document.getElementById(videoId);
      const btn = document.getElementById('btn-video-speed');
      if (!vid) return;
      const speeds = [1.0, 1.25, 1.5, 2.0];
      const curRate = vid.playbackRate || 1.0;
      let nextIdx = speeds.indexOf(curRate) + 1;
      if (nextIdx >= speeds.length || nextIdx < 0) nextIdx = 0;
      const newRate = speeds[nextIdx];
      vid.playbackRate = newRate;
      if (btn) btn.textContent = `${newRate.toFixed(newRate === 1.0 ? 1 : 2).replace(/\.0$/, '.0')}x`;
      const statusEl = document.getElementById('video-status-text');
      if (statusEl) statusEl.textContent = `Tốc độ phát: ${newRate}x`;
    },

    restartVideo(videoId) {
      AudioFX.click();
      const vid = document.getElementById(videoId);
      if (!vid) return;
      vid.currentTime = 0;
      vid.play().catch(() => {});
      const statusEl = document.getElementById('video-status-text');
      if (statusEl) statusEl.textContent = 'Đang phát lại từ đầu (00:00)';
    },

    updateVideoProgress(videoId) {
      const vid = document.getElementById(videoId);
      if (!vid || !vid.duration) return;
      const slider = document.getElementById('video-seek-slider');
      const currTimeEl = document.getElementById('video-curr-time');
      const totalTimeEl = document.getElementById('video-total-time');
      const percent = (vid.currentTime / vid.duration) * 100;
      if (slider && !slider.matches(':active')) {
        slider.value = percent;
        slider.style.background = `linear-gradient(to right, #38BDF8 0%, #38BDF8 ${percent}%, #334155 ${percent}%, #334155 100%)`;
      }
      if (currTimeEl) currTimeEl.textContent = this.formatTime(vid.currentTime);
      if (totalTimeEl && (totalTimeEl.textContent === '00:00' || !totalTimeEl.dataset.ready)) {
        totalTimeEl.textContent = this.formatTime(vid.duration);
        totalTimeEl.dataset.ready = 'true';
      }
    },

    setupVideoPlayer(videoId) {
      const vid = document.getElementById(videoId);
      if (!vid) return;

      const btnToggle = document.getElementById('btn-video-toggle');
      const statusEl = document.getElementById('video-status-text');
      const overlayEl = document.getElementById('video-play-overlay');
      const totalTimeEl = document.getElementById('video-total-time');

      vid.ontimeupdate = () => {
        this.updateVideoProgress(videoId);
      };

      vid.onseeking = () => {
        const statusEl = document.getElementById('video-status-text');
        if (statusEl) statusEl.textContent = `Đang chuyển đến: ${this.formatTime(vid.currentTime)}`;
      };

      vid.onseeked = () => {
        this.updateVideoProgress(videoId);
        const statusEl = document.getElementById('video-status-text');
        if (statusEl) statusEl.textContent = `Đã chuyển đến: ${this.formatTime(vid.currentTime)}`;
      };

      vid.onloadedmetadata = () => {
        if (totalTimeEl) {
          totalTimeEl.textContent = this.formatTime(vid.duration);
          totalTimeEl.dataset.ready = 'true';
        }
        this.updateVideoProgress(videoId);
      };

      vid.oncanplay = () => {
        if (totalTimeEl) totalTimeEl.textContent = this.formatTime(vid.duration);
      };

      vid.onplay = () => {
        if (btnToggle) {
          btnToggle.innerHTML = '⏸ Tạm dừng';
          btnToggle.style.background = '#FDE047';
        }
        if (statusEl) statusEl.textContent = 'Đang phát video tư liệu lịch sử';
        if (overlayEl) overlayEl.style.opacity = '0';
      };

      vid.onpause = () => {
        if (btnToggle) {
          btnToggle.innerHTML = '▶ Phát tiếp';
          btnToggle.style.background = 'var(--accent-orange)';
        }
        if (statusEl) statusEl.textContent = 'Đã tạm dừng (Kéo thanh trượt hoặc bấm ±10s để tua)';
        if (overlayEl) overlayEl.style.opacity = '1';
      };

      vid.onended = () => {
        if (btnToggle) {
          btnToggle.innerHTML = 'Phát lại';
          btnToggle.style.background = 'var(--accent-green)';
        }
        if (statusEl) statusEl.textContent = 'Video đã kết thúc. Bấm xem lại hoặc tua lại.';
        if (overlayEl) overlayEl.style.opacity = '1';
      };

      this.updateVideoProgress(videoId);
    },

    // =============================================================
    // CHẶNG 1: KHÁM PHÁ BẢN ĐỒ TƯ LIỆU (3 MÀN HÌNH TUẦN TỰ)
    // =============================================================
    openHotspot(id) {
      AudioFX.click();
      const modal = document.getElementById('lv1-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      State.lv1.currentCardPage[id] = 0;
      this.renderHotspotStep(id, 1);
    },

    renderHotspotStep(hpId, step, cardPageIdx) {
      // Tự động tạm dừng bất kỳ video nào đang phát khi đổi bước
      const oldVideos = document.querySelectorAll('#m1-content video');
      oldVideos.forEach(v => {
        if (!v.paused) v.pause();
      });

      const data = HOTSPOTS[hpId];
      const badgeEl = document.getElementById('m1-badge');
      if (badgeEl) badgeEl.textContent = data.badge;
      const content = document.getElementById('m1-content');
      if (!content) return;

      if (typeof cardPageIdx !== 'undefined') {
        State.lv1.currentCardPage[hpId] = cardPageIdx;
      }
      const currentCardIdx = State.lv1.currentCardPage[hpId] || 0;

      const stepPills = `
        <div class="modal-step-flow">
          <span class="modal-step-badge ${step === 1 ? 'active' : 'done'}">BƯỚC 1: QUAN SÁT TƯ LIỆU</span>
          <span class="modal-step-badge ${step === 2 ? 'active' : (step > 2 ? 'done' : '')}">BƯỚC 2: THỬ THÁCH NHẬN THỨC</span>
          <span class="modal-step-badge ${step === 3 ? 'active' : ''}">BƯỚC 3: ĐÚC KẾT BÀI HỌC</span>
        </div>
      `;

      // MÀN HÌNH 1: QUAN SÁT TƯ LIỆU LỊCH SỬ
      if (step === 1) {
        let mediaHtml = `
          <div class="inspect-img-wrap">
            <img src="${data.img}" alt="${data.caption}" class="inspect-img">
          </div>
        `;
        if (data.videoSrc) {
          mediaHtml = `
            <div class="video-smart-card">
              <div class="video-container" onclick="Deck.toggleVideoPlay('hotspot-video-player')" title="Bấm vào video để Phát / Tạm dừng">
                <video id="hotspot-video-player" playsinline preload="auto">
                  <source src="${data.videoSrc}" type="video/mp4">
                  Trình duyệt không hỗ trợ phát video MP4.
                </video>
                <div id="video-play-overlay" class="video-play-overlay">
                  <div class="video-play-bubble">▶</div>
                </div>
              </div>

              <div class="video-controls-panel">
                <!-- Thanh trượt tua video (Scrubber / Timeline) -->
                <div class="video-scrubber-row">
                  <span id="video-curr-time" class="video-time-label">00:00</span>
                  <div class="video-slider-wrap">
                    <input type="range" id="video-seek-slider" class="video-seek-slider" min="0" max="100" value="0" step="0.1"
                           aria-label="Thanh kéo tua video"
                           oninput="Deck.onVideoSeekInput('hotspot-video-player', this.value)"
                           onchange="Deck.onVideoSeekChange('hotspot-video-player', this.value)">
                  </div>
                  <span id="video-total-time" class="video-time-label">01:52</span>
                </div>

                <!-- Thanh công cụ điều khiển và tua nhanh/lùi -->
                <div class="video-smart-toolbar">
                  <div class="video-btn-group-left">
                    <button type="button" id="btn-video-toggle" class="btn btn-primary btn-video-action" onclick="Deck.toggleVideoPlay('hotspot-video-player')">
                      ▶ Phát video
                    </button>
                    <button type="button" class="btn btn-secondary btn-seek-step" title="Tua lùi 10 giây (hoặc phím ◀)" onclick="Deck.seekVideo('hotspot-video-player', -10)">
                      -10s
                    </button>
                    <button type="button" class="btn btn-secondary btn-seek-step" title="Tua tới 10 giây (hoặc phím ▶)" onclick="Deck.seekVideo('hotspot-video-player', 10)">
                      +10s
                    </button>
                  </div>

                  <span id="video-status-text" class="video-status-info">
                    Kéo thanh trượt hoặc bấm ±10s để tua video
                  </span>

                  <div class="video-btn-group-right">
                    <button type="button" id="btn-video-speed" class="btn btn-secondary btn-speed" onclick="Deck.cycleVideoSpeed('hotspot-video-player')" title="Đổi tốc độ phát">
                      1.0x
                    </button>
                    <button type="button" class="btn btn-secondary btn-restart" onclick="Deck.restartVideo('hotspot-video-player')" title="Xem lại từ đầu">
                      Xem lại
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        content.innerHTML = `
          ${stepPills}
          ${mediaHtml}
          <div style="font-style: italic; font-size: 13.5px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
            <strong>Tư liệu lịch sử:</strong> ${data.caption}
          </div>
          <div class="k-content-quote" style="font-size: 15px; margin-bottom: 18px; background: #FAF9F6; padding: 14px 18px; border-radius: 8px; border-left: 4px solid var(--accent-pink); line-height: 1.55;">
            ${data.quote}
          </div>
          <button class="btn btn-primary btn-full btn-large" onclick="Deck.renderHotspotStep(${hpId}, 2)">
            [ BẮT ĐẦU THỬ THÁCH NHẬN THỨC (BƯỚC 2) ➔ ]
          </button>
        `;

        if (data.videoSrc) {
          setTimeout(() => {
            Deck.setupVideoPlayer('hotspot-video-player');
          }, 40);
        }
      }
      // MÀN HÌNH 2: THỬ THÁCH NHANH KIỂM TRA NHẬN THỨC
      else if (step === 2) {
        let optionsHtml = '';
        data.options.forEach(opt => {
          optionsHtml += `
            <button class="stage-opt-btn" onclick="Deck.answerHotspot(${hpId}, ${opt.correct || false}, this)">
              <span class="brutal-badge badge-black" style="font-size: 13px; padding: 3px 8px;">${opt.key}</span>
              <span style="flex: 1;">${opt.text}</span>
            </button>
          `;
        });

        content.innerHTML = `
          ${stepPills}
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px; background: #F9FAFB; padding: 12px 16px; border: 1.5px solid var(--border-color); border-radius: 8px;">
            <img src="${data.img}" alt="Thumb" style="width: 80px; height: 55px; object-fit: cover; border-radius: 4px; border: 1.5px solid #000; flex-shrink: 0;">
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.45;">
              <strong>Tư liệu tham chiếu:</strong> ${data.caption}
            </div>
          </div>
          <h4 style="font-size: 16.5px; font-weight: 800; margin-bottom: 16px; line-height: 1.45; color: var(--text-primary);">${data.question}</h4>
          <div class="stage-options-grid">${optionsHtml}</div>
          <div id="hp-fb" style="display: none; margin-top: 14px;"></div>
        `;
      }
      // MÀN HÌNH 3: ĐÚC KẾT BÀI HỌC (CARD VIEW PAGINATION)
      else if (step === 3) {
        if (!State.lv1.hasVisitedStep3) State.lv1.hasVisitedStep3 = {};
        State.lv1.hasVisitedStep3[hpId] = true;
        const pages = data.cardPages;
        const page = pages[currentCardIdx] || pages[0];
        const isLastPage = currentCardIdx === pages.length - 1;

        let cardsHtml = '';
        if (page.cards && page.cards.length > 0) {
          page.cards.forEach(card => {
            const extraClass = card.panoramic ? 'panoramic' : (card.single ? 'single' : '');
            cardsHtml += `
              <div class="story-card-item ${extraClass}">
                <h4>${card.title}</h4>
                <div class="story-card-body">${card.body}</div>
              </div>
            `;
          });
        }

        let actionBtnHtml = '';
        if (isLastPage) {
          const isCorrect = State.lv1.quizStatus[hpId] === true;
          if (isCorrect) {
            actionBtnHtml = `
              <div style="margin-top: 16px;">
                <button class="btn btn-primary btn-full btn-large" onclick="Deck.collectClue(${hpId})">
                  [ LƯU VÀO SỔ TAY TƯ TƯỞNG & HOÀN THÀNH ➔ ]
                </button>
              </div>
            `;
          } else {
            actionBtnHtml = `
              <div style="margin-top: 16px; background: #FEF3C7; border: 2px solid #D97706; border-radius: 8px; padding: 14px 18px; text-align: left;">
                <div style="font-weight: 800; color: #92400E; margin-bottom: 6px; font-size: 14px;">
                  [CHÚ Ý] BẠN CẦN KIỂM CHỨNG LẠI THỬ THÁCH NHẬN THỨC!
                </div>
                <p style="font-size: 13px; color: #78350F; line-height: 1.5; margin-bottom: 12px;">
                  Ở Bước 2, bạn chưa chọn đúng đáp án chuẩn mực. Giờ đây sau khi đã nghiên cứu toàn bộ nội dung bài học, hãy quay lại thử sức câu hỏi trắc nghiệm một lần nữa để chính thức giải mã manh mối nhé!
                </p>
                <button class="btn btn-primary btn-full" onclick="Deck.renderHotspotStep(${hpId}, 2)">
                  [ THỬ SỨC LẠI CÂU TRẮC NGHIỆM ĐỂ MỞ KHÓA MANH MỐI ➔ ]
                </button>
              </div>
            `;
          }
        }

        const prevBtn = currentCardIdx > 0
          ? `<button class="btn btn-secondary" onclick="Deck.renderHotspotStep(${hpId}, 3, ${currentCardIdx - 1})">◀ Quay lại</button>`
          : `<button class="btn btn-secondary" onclick="Deck.renderHotspotStep(${hpId}, 2)">◀ Quay lại câu hỏi</button>`;

        const nextBtn = !isLastPage
          ? `<button class="btn btn-primary" onclick="Deck.renderHotspotStep(${hpId}, 3, ${currentCardIdx + 1})">Tiếp theo (Next) ➔</button>`
          : '';

        content.innerHTML = `
          ${stepPills}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: #FFF; padding: 8px 14px; border: 1.5px solid var(--border-color); border-radius: 8px;">
            <span style="font-size: 13.5px; font-weight: 800; color: #B91C1C; font-family: var(--font-display);">
              ${page.partTitle || 'NỘI DUNG BÀI HỌC'}
            </span>
            <span class="story-stepper-text">Trang ${currentCardIdx + 1} / ${pages.length}</span>
          </div>

          <div class="story-cards-grid">
            ${cardsHtml}
          </div>

          <div class="story-nav-bar">
            ${prevBtn}
            <span class="story-stepper-text">Bước ${currentCardIdx + 1} / ${pages.length}</span>
            ${nextBtn}
          </div>

          ${actionBtnHtml}
        `;
      }
    },

    answerHotspot(hpId, isCorrect, btnEl) {
      const fb = document.getElementById('hp-fb');
      if (!fb) return;
      const data = HOTSPOTS[hpId];
      if (!data) return;

      // Lưu trạng thái trả lời của người dùng
      State.lv1.quizStatus[hpId] = isCorrect;

      // Gỡ trạng thái cũ khỏi tất cả các nút
      const allBtns = document.querySelectorAll('.stage-opt-btn');
      allBtns.forEach(b => {
        b.classList.remove('correct');
        b.classList.remove('wrong');
      });

      if (isCorrect) {
        AudioFX.success();
        btnEl.classList.add('correct');
        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.style.background = '#F0FDF4';
        fb.style.borderColor = '#16A34A';

        const hasVisitedStep3 = State.lv1.hasVisitedStep3 && State.lv1.hasVisitedStep3[hpId];
        const lastPageIdx = (data.cardPages && data.cardPages.length > 0) ? data.cardPages.length - 1 : 0;

        if (hasVisitedStep3) {
          // Người dùng quay lại thử sức và trả lời đúng -> Hiển thị nút đến Bức tranh toàn cảnh, KHÔNG tự ý nhảy
          fb.innerHTML = `
            <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 6px;">✓ Hoàn toàn chính xác! Bạn đã vượt qua thử thách nhận thức.</strong>
            <span style="color: #14532D; font-size: 13px;">Manh mối tư tưởng đã được kích hoạt! Bấm nút bên dưới khi bạn sẵn sàng xem Bức tranh toàn cảnh.</span>
            <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="Deck.renderHotspotStep(${hpId}, 3, ${lastPageIdx})">
              TIẾP TỤC: XEM BỨC TRANH TOÀN CẢNH & HOÀN THÀNH ➔
            </button>
          `;
        } else {
          // Lần đầu trả lời đúng -> Hiển thị nút, KHÔNG tự ý nhảy
          fb.innerHTML = `
            <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 6px;">✓ Chính xác! Bạn đã tìm ra manh mối quan trọng.</strong>
            <span style="color: #14532D; font-size: 13px;">Hãy cùng khám phá nội dung bài học để hiểu rõ hơn nhé!</span>
            <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="Deck.renderHotspotStep(${hpId}, 3, 0)">
              TIẾP TỤC: KHÁM PHÁ BÀI HỌC (BƯỚC 3) ➔
            </button>
          `;
        }
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEF2F2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong style="color: #991B1B; font-size: 14px; display: block; margin-bottom: 6px;">Chưa phải đáp án này!</strong>
          <span style="color: #7F1D1D; font-size: 13px;">Đừng lo, manh mối vẫn còn đó. Hãy khám phá bài học, rồi quay lại thử sức một lần nữa nhé!</span>
          <button class="btn btn-primary" style="margin-top: 12px; width: 100%; background: #DC2626; border-color: #991B1B;" onclick="Deck.renderHotspotStep(${hpId}, 3, 0)">
            TIẾP TỤC: KHÁM PHÁ BÀI HỌC ĐỂ TÌM MANH MỐI ➔
          </button>
        `;
      }
    },

    collectClue(hpId) {
      AudioFX.fanfare();
      State.lv1.clues[hpId - 1] = true;
      const card = document.getElementById(`hp-card-${hpId}`);
      if (card) card.classList.add('completed');
      const statusEl = document.getElementById(`hp-status-${hpId}`);
      if (statusEl) statusEl.innerHTML = '✓ ĐÃ GIẢI MÃ';

      const count = State.lv1.clues.filter(Boolean).length;
      const statClues = document.getElementById('lv1-stat-clues');
      if (statClues) statClues.textContent = `${count} / 4`;

      this.closeModal('lv1-modal');

      if (count === 4) {
        const completeBox = document.getElementById('lv1-complete-box');
        if (completeBox) completeBox.style.display = 'flex';
      }
    },

    // =============================================================
    // CHẶNG 2: BẢNG QUYẾT SÁCH CHIẾN LƯỢC (THỊNH - 3.1.2)
    // =============================================================
    openStrategyModal(nodeId) {
      AudioFX.click();
      const modal = document.getElementById('lv2-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      
      // Nếu đã từng trả lời đúng, mở ngay trang luận giải chi tiết; nếu chưa thì mở câu hỏi
      const step = State.lv2.choices[nodeId] ? 2 : 1;
      this.renderStrategyStep(nodeId, step);
    },

    renderStrategyStep(nodeId, step) {
      const data = STRATEGIES[nodeId];
      if (!data) return;

      const badgeEl = document.getElementById('m2-badge');
      if (badgeEl) badgeEl.textContent = `QUYẾT SÁCH 0${nodeId} // ${data.name}`;

      const content = document.getElementById('m2-content');
      if (!content) return;

      const isAnswered = !!State.lv2.choices[nodeId];

      // Thanh tab phân luồng điều hướng Neo-Brutalist (2 bước: Câu hỏi -> Đúng 1 Trang bài học toàn diện)
      const stepPills = `
        <div class="strat-step-nav">
          <button type="button" class="strat-step-tab ${step === 1 ? 'active' : (isAnswered ? 'done' : '')}" onclick="Deck.renderStrategyStep(${nodeId}, 1)">
            ${isAnswered ? '✓ ' : ''}BƯỚC 1: THỬ THÁCH NHẬN THỨC
          </button>
          <button type="button" class="strat-step-tab ${step === 2 ? 'active' : ''} ${!isAnswered ? 'disabled' : ''}" onclick="${isAnswered ? `Deck.renderStrategyStep(${nodeId}, 2)` : ''}">
            ${isAnswered ? '★ ' : ''}BƯỚC 2: BÀI HỌC TOÀN DIỆN (1 TRANG)
          </button>
        </div>
      `;

      // BƯỚC 1: 1 CÂU HỎI TRẮC NGHIỆM DUY NHẤT
      if (step === 1) {
        const imageBlock = `
          <div class="inspect-img-wrap" style="height: 190px; margin-bottom: 8px;">
            <img src="${data.img}" alt="${data.caption}" class="inspect-img">
          </div>
          <div style="font-style: italic; font-size: 12px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
            <strong>Tư liệu lịch sử:</strong> ${data.caption}
          </div>
        `;

        let optsHtml = '';
        data.options.forEach(opt => {
          const isChosen = State.lv2.choices[nodeId] === opt.key;
          optsHtml += `
            <button class="stage-opt-btn ${isChosen ? 'correct' : ''}" onclick="Deck.pickStrategyAnswer(${nodeId}, '${opt.key}', ${opt.correct || false}, this)">
              <span class="brutal-badge badge-green">${opt.key}</span>
              <span>${opt.text}</span>
            </button>
          `;
        });

        const feedbackHtml = isAnswered ? `
          <div id="strat-fb" class="stage-feedback-box" style="display: block; background: #F0FDF4; border-color: #16A34A; margin-top: 14px;">
            <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 4px;">✓ BẠN ĐÃ TRẢ LỜI CHÍNH XÁC!</strong>
            <div style="font-size: 13px; margin-bottom: 12px; color: #14532D;">${data.summary}</div>
            <button class="btn btn-primary" style="width: 100%;" onclick="Deck.renderStrategyStep(${nodeId}, 2)">
              BẮT ĐẦU TÌM HIỂU BÀI HỌC TOÀN DIỆN (BƯỚC 2) ➔
            </button>
          </div>
        ` : `
          <div id="strat-fb" style="display: none; margin-top: 14px;"></div>
        `;

        content.innerHTML = `
          ${stepPills}
          ${imageBlock}
          <div style="background: #F8FAFC; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 14px;">
            <span class="brutal-badge badge-blue" style="margin-bottom: 6px; display: inline-block;">CÂU HỎI TRỌNG TÂM</span>
            <h3 style="font-size: 16px; font-weight: 800; margin: 0; line-height: 1.45; color: #0F172A;">${data.q}</h3>
          </div>
          <div class="stage-options-grid">${optsHtml}</div>
          ${feedbackHtml}
        `;
      }
      // BƯỚC 2: BÀI HỌC TOÀN DIỆN & KẾT LUẬN CỐT LÕI (ĐÚNG 1 TRANG DUY NHẤT)
      else if (step === 2) {
        content.innerHTML = `
          ${stepPills}
          <div class="strat-section-header">
            <span class="brutal-badge badge-green">${data.lesson.badge}</span>
            <h3>${data.lesson.title}</h3>
          </div>

          <div style="animation: fadeIn 0.25s ease;">
            ${data.lesson.html}
          </div>

          <div class="strat-takeaway-box">
            <div class="strat-takeaway-header">★ BÀI HỌC KẾT LUẬN CỐT LÕI</div>
            <div class="strat-takeaway-body">${data.lesson.takeaway}</div>
          </div>

          <div class="strat-footer-btns">
            <button class="btn btn-secondary" onclick="Deck.renderStrategyStep(${nodeId}, 1)">
              ◀ Xem lại câu hỏi
            </button>
            <button class="btn btn-primary" onclick="Deck.confirmStrategyChoice(${nodeId})">
              ✓ XÁC NHẬN VÀO BẢNG CHIẾN LƯỢC (HOÀN THÀNH) ➔
            </button>
          </div>
        `;
      }
    },

    pickStrategyAnswer(nodeId, key, isCorrect, btnEl) {
      const fb = document.getElementById('strat-fb');
      if (!fb) return;
      const data = STRATEGIES[nodeId];

      // Gỡ bỏ trạng thái của các nút khác trong lưới
      const allBtns = document.querySelectorAll('.stage-opt-btn');
      allBtns.forEach(b => {
        b.classList.remove('correct');
        b.classList.remove('wrong');
      });

      if (isCorrect) {
        AudioFX.success();
        btnEl.classList.add('correct');
        State.lv2.choices[nodeId] = key;

        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.style.background = '#F0FDF4';
        fb.style.borderColor = '#16A34A';
        fb.innerHTML = `
          <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 4px;">QUYẾT SÁCH HOÀN TOÀN CHÍNH XÁC! ✓</strong>
          <div style="font-size: 13px; margin-bottom: 12px; color: #14532D;">${data.summary}</div>
          <button class="btn btn-primary" style="width: 100%;" onclick="Deck.renderStrategyStep(${nodeId}, 2)">
            BẮT ĐẦU TÌM HIỂU BÀI HỌC TOÀN DIỆN (BƯỚC 2) ➔
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEE2E2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong style="color: #991B1B; font-size: 14px; display: block; margin-bottom: 4px;">LỰA CHỌN CHƯA PHÙ HỢP!</strong>
          <span style="color: #7F1D1D; font-size: 13px;">Hãy liên hệ bối cảnh lịch sử và quan điểm cốt lõi của Chủ tịch Hồ Chí Minh trong giáo trình để chọn lại đáp án đúng đắn nhé!</span>
        `;
      }
    },

    confirmStrategyChoice(nodeId) {
      AudioFX.fanfare();
      const card = document.getElementById(`scard-${nodeId}`);
      if (card) card.classList.add('selected');
      const choiceEl = document.getElementById(`schoice-${nodeId}`);
      if (choiceEl) choiceEl.innerHTML = `<strong>✓ ĐÃ XÁC LẬP</strong>`;

      const completed = Object.keys(State.lv2.choices).length;
      const countEl = document.getElementById('lv2-stat-count');
      if (countEl) countEl.textContent = `${completed} / 5`;

      this.closeModal('lv2-modal');

      if (completed === 5) {
        const btn = document.getElementById('btn-reveal-strategy');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'CÔNG BỐ TOÀN VĂN HỆ THỐNG CHIẾN LƯỢC (5/5) ➔';
        }
      }
    },

    // =============================================================
    // CHẶNG 3: MÔ PHỎNG NGUỒN LỰC XÃ HỘI (VINH - 3.2.1)
    // =============================================================
    initLevel3Inputs() {
      const pol = document.getElementById('sl-pol');
      const eco = document.getElementById('sl-eco');
      const cul = document.getElementById('sl-cul');
      const soc = document.getElementById('sl-soc');

      if (!pol || !eco || !cul || !soc) return;

      const updateValues = (isUserInteraction = true) => {
        const p = parseInt(pol.value, 10) || 0;
        const e = parseInt(eco.value, 10) || 0;
        const c = parseInt(cul.value, 10) || 0;
        const s = parseInt(soc.value, 10) || 0;

        const dispPol = document.getElementById('disp-pol');
        const dispEco = document.getElementById('disp-eco');
        const dispCul = document.getElementById('disp-cul');
        const dispSoc = document.getElementById('disp-soc');

        if (dispPol) dispPol.textContent = `${p} ĐNL`;
        if (dispEco) dispEco.textContent = `${e} ĐNL`;
        if (dispCul) dispCul.textContent = `${c} ĐNL`;
        if (dispSoc) dispSoc.textContent = `${s} ĐNL`;

        const total = p + e + c + s;
        const rem = 100 - total;
        const badge = document.getElementById('slide3-rp-badge');
        const errBanner = document.getElementById('sim-error-banner');
        if (errBanner) errBanner.style.display = 'none';

        if (badge) {
          if (total === 100) {
            badge.style.background = 'var(--accent-green)';
            badge.style.color = '#166534';
            badge.innerHTML = `ĐÃ ĐỦ: <strong>100 / 100 ĐNL (SẴN SÀNG ✓)</strong>`;
          } else if (total < 100) {
            badge.style.background = 'var(--accent-orange)';
            badge.style.color = '#7C2D12';
            badge.innerHTML = `ĐÃ DÙNG: <strong>${total} / 100 ĐNL</strong> (Còn thiếu ${rem} ĐNL)`;
          } else {
            badge.style.background = '#FEE2E2';
            badge.style.color = '#991B1B';
            badge.innerHTML = `VƯỢT QUÁ: <strong>${total} / 100 ĐNL</strong> (Thừa ${Math.abs(rem)} ĐNL)`;
          }
        }

        State.lv3 = { pol: p, eco: e, cul: c, soc: s };

        // PHẢN ỨNG THỜI GIAN THỰC LIÊN TỤC
        this.evaluateLiveSimulation(p, e, c, s, total, isUserInteraction);
      };

      [pol, eco, cul, soc].forEach(inp => {
        inp.addEventListener('input', () => {
          updateValues(true);
        });
      });

      // Khởi tạo ban đầu
      updateValues(false);
    },

    stepSlider(type, delta) {
      AudioFX.click();
      const input = document.getElementById(`sl-${type}`);
      if (!input) return;
      let val = parseInt(input.value, 10) || 0;
      val = Math.max(0, Math.min(70, val + delta));
      input.value = val;
      input.dispatchEvent(new Event('input'));
    },

    setPreset(p, e, c, s) {
      AudioFX.click();
      const pol = document.getElementById('sl-pol');
      const eco = document.getElementById('sl-eco');
      const cul = document.getElementById('sl-cul');
      const soc = document.getElementById('sl-soc');

      if (!pol || !eco || !cul || !soc) return;

      pol.value = p;
      eco.value = e;
      cul.value = c;
      soc.value = s;

      pol.dispatchEvent(new Event('input'));
    },

    evaluateLiveSimulation(pol, eco, cul, soc, total, isUserInteraction) {
      const title = document.getElementById('sim-res-title');
      const badge = document.getElementById('sim-res-badge');
      const desc = document.getElementById('sim-res-desc');
      const actionBtn = document.getElementById('btn-sim-action');
      const leftBuildBtn = document.getElementById('btn-build-sim');

      if (!title || !badge || !desc) return;

      // LUÔN ĐỒNG BỘ 4 THANH TIẾN ĐỘ THỜI GIAN THỰC CHÍNH XÁC THEO NGUỒN LỰC ĐÃ KÉO
      this.setBars(pol, eco, cul, soc);

      // 1. Trạng thái ban đầu: Tổng 0
      if (total === 0) {
        title.textContent = 'HỆ THỐNG CHỜ PHÂN BỔ NGUỒN LỰC';
        badge.className = 'sim-status-badge pending';
        badge.textContent = 'CHƯA PHÂN BỔ ĐỦ 100 ĐNL';
        desc.innerHTML = 'Kéo các thanh trượt bên trái hoặc bấm vào các nút kịch bản thử nghiệm để quan sát hệ thống phân tích và đánh giá phản hồi ngay lập tức.';
        if (actionBtn) {
          actionBtn.className = 'btn btn-secondary btn-full';
          actionBtn.innerHTML = 'CẦN PHÂN BỔ VỪA ĐÚNG 100 ĐNL ĐỂ XÁC NHẬN';
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = '[ XÁC NHẬN MÔ HÌNH XÃ HỘI (0/100 ĐNL) ➔ ]';
        }
        return;
      }

      // 2. Trạng thái đang phân bổ: Chưa đủ hoặc quá tải 100
      if (total !== 100) {
        const rem = 100 - total;
        if (rem > 0) {
          title.textContent = `ĐANG PHÂN BỔ DỰ KIẾN (${total}/100 ĐNL)`;
          badge.className = 'sim-status-badge pending';
          badge.textContent = `CẦN BỔ SUNG THÊM ${rem} ĐNL`;
          desc.innerHTML = `Nguồn lực quốc gia chưa phân bổ hết (còn thiếu <strong>${rem} ĐNL</strong>). Hãy tiếp tục điều chỉnh các thanh trượt để kích hoạt toàn diện mô hình xã hội!`;
        } else {
          title.textContent = `CẢNH BÁO QUÁ TẢI NGUỒN LỰC (${total}/100 ĐNL)`;
          badge.className = 'sim-status-badge failed';
          badge.textContent = `VƯỢT QUÁ ${Math.abs(rem)} ĐNL (QUÁ TẢI)`;
          desc.innerHTML = `Tổng nguồn lực phân bổ đang vượt quá 100 ĐNL (thừa <strong>${Math.abs(rem)} ĐNL</strong>). Vui lòng giảm bớt các thanh trượt về đúng hạn mức!`;
        }

        if (actionBtn) {
          actionBtn.className = 'btn btn-secondary btn-full';
          actionBtn.innerHTML = `CẦN PHÂN BỔ VỪA ĐÚNG 100 ĐNL (ĐANG CÓ: ${total}/100)`;
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = `[ XÁC NHẬN MÔ HÌNH XÃ HỘI (${total}/100 ĐNL) ➔ ]`;
        }
        return;
      }

      // 3. Đúng 100 ĐNL: Đánh giá Ma trận Đánh đổi theo đúng thực tế phân bổ
      if (eco >= 55) {
        title.textContent = 'ƯU TIÊN TĂNG TRƯỞNG KINH TẾ ĐƠN THUẦN — NGUY CƠ BẤT BÌNH ĐẲNG';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = `<strong>Phân tích định hướng khi Kinh tế chiếm ${eco}% (${eco} ĐNL):</strong> Khi dồn phần lớn nguồn lực để thúc đẩy tăng trưởng kinh tế đơn thuần mà xem nhẹ các mặt khác, của cải vật chất có thể gia tăng nhưng khoảng cách giàu nghèo sẽ nới rộng; đời sống văn hóa, đạo đức tinh thần dễ bị xói mòn do lối sống thực dụng chạy theo vật chất.<br><em><strong>Lời Bác dạy:</strong> Bác khẳng định kinh tế là nền tảng của xã hội, nhưng mục tiêu của CNXH là đem lại đời sống ấm no, tự do, hạnh phúc cho toàn thể nhân dân — chứ không vì sự giàu sang của một thiểu số. Phát triển kinh tế phải luôn gắn liền với tiến bộ, công bằng xã hội và bồi đắp văn hóa.</em>`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ ƯU TIÊN MẠNH KINH TẾ (CHƯA CÂN BẰNG) ]';
      }
      else if (soc >= 55) {
        title.textContent = 'DỒN LỰC CHO PHÚC LỢI KHI NỀN KINH TẾ CHƯA ĐỦ LỰC';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = `<strong>Phân tích định hướng khi Xã hội chiếm ${soc}% (${soc} ĐNL):</strong> Chăm lo an sinh và phúc lợi xã hội là bản chất ưu việt của CNXH, nhưng nếu mở rộng bao cấp, bình quân khi nguồn của cải tích lũy chưa đủ lớn thì dễ làm cạn kiệt ngân sách quốc gia và triệt tiêu động lực thi đua sáng tạo của người lao động.<br><em><strong>Lời Bác dạy:</strong> Bác căn dặn nguyên tắc công bằng rất rõ: "Làm nhiều hưởng nhiều, làm ít hưởng ít, không làm không hưởng". Phải tích cực lao động sản xuất, tăng gia tiết kiệm tạo ra của cải dồi dào trước thì chính sách an sinh xã hội mới bền vững và thực chất.</em>`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ PHÚC LỢI VƯỢT KHẢ NĂNG (CHƯA CÂN BẰNG) ]';
      }
      else if (pol >= 55) {
        title.textContent = 'TẬP TRUNG BỘ MÁY HÀNH CHÍNH — NGUY CƠ QUAN LIÊU, MỆNH LỆNH';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = `<strong>Phân tích định hướng khi Chính trị chiếm ${pol}% (${pol} ĐNL):</strong> Việc dồn quá nhiều nguồn lực vào bộ máy quản lý hành chính dễ dẫn đến tình trạng quan liêu, cồng kềnh, mệnh lệnh hành chính xa rời đời sống nhân dân, làm suy giảm tính năng động, sáng tạo và quyền làm chủ thực sự của người dân.<br><em><strong>Lời Bác dạy:</strong> Bác căn dặn: "Các cơ quan của Chính phủ đều là đầy tớ của dân, chứ không phải là quan cách mạng để đè đầu cưỡi cổ dân". Quyền làm chủ của nhân dân phải được thực thi sinh động trong đời sống, không thể thay thế bằng mệnh lệnh hành chính xơ cứng.</em>`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ BỘ MÁY QUẢN LÝ CỒNG KỀNH (CHƯA CÂN BẰNG) ]';
      }
      else if (cul >= 55) {
        title.textContent = 'CHÚ TRỌNG VĂN HÓA ĐƠN THUẦN — THIẾU NỀN TẢNG VẬT CHẤT';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = `<strong>Phân tích định hướng khi Văn hóa chiếm ${cul}% (${cul} ĐNL):</strong> Đề cao giáo dục và bồi dưỡng tư tưởng là rất quý báu, nhưng nếu tách rời nhiệm vụ sản xuất kinh tế thì đời sống vật chất không được đảm bảo, lý tưởng giáo dục thiếu chỗ dựa thực tế để phát huy hiệu quả.<br><em><strong>Lời Bác dạy:</strong> Bác khẳng định chân lý sâu sắc mà giản dị: "Có thực mới vực được đạo" — Trước hết phải chăm lo cho dân có đủ cơm ăn, áo ấm, việc làm ổn định thì mới có điều kiện nâng cao dân trí và xây dựng nền văn hóa mới.</em>`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ THIẾU NỀN TẢNG VẬT CHẤT (CHƯA CÂN BẰNG) ]';
      }
      else if (eco >= 20 && eco <= 40 && pol >= 15 && pol <= 35 && cul >= 15 && cul <= 30 && soc >= 20 && soc <= 35) {
        title.textContent = 'MÔ HÌNH HÀI HÒA THEO ĐÚNG TƯ TƯỞNG BÁC HỒ';
        badge.className = 'sim-status-badge success';
        badge.textContent = 'XUẤT SẮC: PHÁT TRIỂN TOÀN DIỆN & BỀN VỮNG ✓';
        desc.innerHTML = `<strong>Mô hình phân bổ đạt chuẩn: Chính trị ${pol}% - Kinh tế ${eco}% - Văn hóa ${cul}% - Xã hội ${soc}%!</strong><br><strong>Bài học cốt lõi từ Bác:</strong> Phát triển đất nước phải kết hợp nhịp nhàng cả 4 mặt:<br>• <strong>Chính trị (${pol}%):</strong> Nhân dân thực sự làm chủ, chính quyền gần gũi và vì dân phục vụ.<br>• <strong>Kinh tế (${eco}%):</strong> Lao động sản xuất giỏi để đất nước giàu có, no đủ của cải.<br>• <strong>Văn hóa (${cul}%):</strong> Mở mang trường học, nâng cao hiểu biết và sống có đạo đức.<br>• <strong>Xã hội (${soc}%):</strong> Công bằng, chăm lo y tế, giúp đỡ người nghèo, không ai bị bỏ rơi.`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-primary btn-full';
          actionBtn.innerHTML = 'XÁC NHẬN MÔ HÌNH ĐẠT CHUẨN ➔ TIẾN VÀO CHẶNG 4 ➔';
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = '[ MÔ HÌNH HÀI HÒA THEO BÁC ➔ TIẾN BƯỚC ➔ ]';
        }
      }
      else {
        title.textContent = 'MÔ HÌNH CHƯA CÂN BẰNG HỢP LÝ';
        badge.className = 'sim-status-badge pending';
        badge.textContent = 'CẦN ĐIỀU CHỈNH LẠI ✕';
        desc.innerHTML = `Phân bổ hiện tại (Chính trị ${pol}%, Kinh tế ${eco}%, Văn hóa ${cul}%, Xã hội ${soc}%) chưa thật sự hài hòa. Gợi ý từ Bác Hồ: Hãy đầu tư Kinh tế làm nền tảng (khoảng 25–35 điểm), giữ Chính trị dân chủ vì dân (20–30 điểm), bồi dưỡng Văn hóa con người (15–25 điểm) và chăm lo Đời sống xã hội (20–30 điểm).`;
        if (actionBtn) {
          actionBtn.className = 'btn btn-secondary btn-full';
          actionBtn.innerHTML = 'CHƯA CÂN BẰNG — HÃY ĐIỀU CHỈNH LẠI TỶ LỆ';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ CHƯA CÂN BẰNG — CẦN ĐIỀU CHỈNH ]';
      }
    },

    buildSocietyAction() {
      const { pol, eco, cul, soc } = State.lv3;
      const total = pol + eco + cul + soc;
      const errBanner = document.getElementById('sim-error-banner');

      if (total !== 100) {
        AudioFX.error();
        const rem = 100 - total;
        if (errBanner) {
          errBanner.style.display = 'block';
          errBanner.innerHTML = `[CHÚ Ý] Tổng điểm đang là <strong>${total}/100 ĐNL</strong>. Bạn cần phân bổ vừa đúng 100 ĐNL trước khi chốt! (${rem > 0 ? 'Còn thiếu ' + rem : 'Đang vượt quá ' + Math.abs(rem)} ĐNL)`;
        }
        return;
      }

      const isBalanced = (eco >= 20 && eco <= 40 && pol >= 15 && pol <= 35 && cul >= 15 && cul <= 30 && soc >= 20 && soc <= 35);
      if (isBalanced) {
        AudioFX.fanfare();
        this.goToSlide(7);
      } else {
        AudioFX.error();
        if (errBanner) {
          errBanner.style.display = 'block';
          errBanner.innerHTML = `[CHÚ Ý] Mô hình hiện tại chưa đạt chuẩn hài hòa Hồ Chí Minh! Hãy quan sát phân tích ở bảng bên phải và điều chỉnh lại.`;
        }
      }
    },

    setBars(p, e, c, s) {
      const mbPol = document.getElementById('mb-pol');
      const bfPol = document.getElementById('bf-pol');
      const mbEco = document.getElementById('mb-eco');
      const bfEco = document.getElementById('bf-eco');
      const mbCul = document.getElementById('mb-cul');
      const bfCul = document.getElementById('bf-cul');
      const mbSoc = document.getElementById('mb-soc');
      const bfSoc = document.getElementById('bf-soc');

      const items = [
        { mb: mbPol, bf: bfPol, val: p, safeMin: 15, safeMax: 35 },
        { mb: mbEco, bf: bfEco, val: e, safeMin: 20, safeMax: 40 },
        { mb: mbCul, bf: bfCul, val: c, safeMin: 15, safeMax: 30 },
        { mb: mbSoc, bf: bfSoc, val: s, safeMin: 20, safeMax: 35 }
      ];

      items.forEach(item => {
        if (item.mb) item.mb.textContent = `${item.val}%`;
        if (item.bf) {
          const w = Math.min(100, Math.max(0, item.val));
          item.bf.style.width = `${w}%`;
          if (item.val === 0) {
            item.bf.style.background = '#64748B';
          } else if (item.val >= 50) {
            item.bf.style.background = '#EF4444'; // Đỏ: Quá đà, áp đảo
          } else if (item.val < item.safeMin) {
            item.bf.style.background = '#F59E0B'; // Vàng cam: Thiếu hụt
          } else {
            item.bf.style.background = '#4ADE80'; // Xanh lá: Hài hòa
          }
        }
      });
    },

    // =============================================================
    // CHẶNG 4: 4 BÀI TOÁN THỰC TIỄN VIỆT NAM (TÂN - 3.2.2)
    // =============================================================
    renderChallengeStage(chId) {
      State.lv4.currentIdx = chId;
      const tracker = document.getElementById('ch-tracker-text');
      if (tracker) tracker.textContent = `Thử thách: ${chId} / 4`;
      const data = CHALLENGES[chId];
      const card = document.getElementById('challenge-stage-card');
      if (!card || !data) return;

      let optsHtml = '';
      data.options.forEach(opt => {
        optsHtml += `
          <button class="stage-opt-btn" onclick="Deck.pickChallenge(${chId}, ${opt.correct || false}, this)">
            <span class="brutal-badge badge-purple">${opt.key}</span>
            <span>${opt.text}</span>
          </button>
        `;
      });

      card.innerHTML = `
        <span class="challenge-stage-tag">${data.badge}</span>
        <h3 class="challenge-stage-title" style="margin-bottom: 14px;">${data.title}</h3>
        <div class="challenge-stage-card-inner">
          <div class="challenge-stage-visual">
            <div class="ch-img-wrap">
              <img src="${data.img}" alt="${data.caption}" class="ch-img">
            </div>
            <div class="ch-caption">${data.caption}</div>
          </div>
          <div class="challenge-stage-main">
            <div class="challenge-stage-context" style="margin-bottom: 12px;">${data.desc}</div>
            <div class="stage-options-grid">${optsHtml}</div>
            <div id="ch-fb" style="display: none; margin-top: 14px;"></div>
          </div>
        </div>
      `;
    },

    pickChallenge(chId, isCorrect, btnEl) {
      const fb = document.getElementById('ch-fb');
      const data = CHALLENGES[chId];
      if (!fb || !data) return;

      if (isCorrect) {
        AudioFX.success();
        btnEl.classList.add('correct');
        // Disable other buttons once correct
        document.querySelectorAll('.stage-opt-btn').forEach(b => {
          if (b !== btnEl) b.style.opacity = '0.5';
          b.disabled = true;
        });
        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <div class="ch-feedback-header">
            <span class="ch-correct-badge">QUYẾT SÁCH CHÍNH XÁC! ✓</span>
          </div>
          <div class="ch-takeaway-box">
            <div class="ch-takeaway-label">🎯 CHỐT KIẾN THỨC CỐT LÕI:</div>
            <div class="ch-takeaway-text">“${data.chot}”</div>
          </div>
          <details class="ch-speech-details">
            <summary class="ch-speech-summary">🎙️ Lời thoại thuyết trình gợi ý cho Tân (Bấm để xem)</summary>
            <div class="ch-speech-body">“${data.speech}”</div>
          </details>
          <button class="btn btn-primary btn-large" style="margin-top: 12px; width: 100%; justify-content: center;" onclick="Deck.nextChallenge(${chId})">
            ${chId < 4 ? `TIẾP TỤC ➔ THỬ THÁCH 0${chId + 1} ➔` : 'HOÀN THÀNH ➔ XEM TỔNG HỢP NGUYÊN TẮC CỐT LÕI ➔'}
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box ch-wrong-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <div style="font-weight: 800; color: #DC2626; margin-bottom: 4px;">❌ CHƯA PHÙ HỢP!</div>
          <div style="font-size: 13px; color: #991B1B;">Quyết sách này có nguy cơ nóng vội, đốt cháy giai đoạn hoặc chưa sát thực tiễn Việt Nam. Bạn hãy thảo luận và lựa chọn lại!</div>
        `;
      }
    },

    nextChallenge(currentId) {
      AudioFX.click();
      if (currentId < 4) {
        this.renderChallengeStage(currentId + 1);
      } else {
        this.goToSlide(9); // Slide 9 là Tổng kết tri thức cốt lõi
      }
    },

    // =============================================================
    // TỔNG KẾT & TRANH LUẬN (ÁNH)
    // =============================================================
    selectBossPoll(optKey) {
      State.boss.pollSelected = optKey;
      const choices = document.querySelectorAll('.boss-card-choice');
      choices.forEach(c => {
        c.style.borderColor = 'var(--border-color)';
        c.style.background = '#FFF';
        c.style.boxShadow = 'var(--shadow-hard)';
      });

      const cardC = choices[2]; // Thẻ C: KẾT HỢP BIỆN CHỨNG CẢ HAI
      if (optKey === 'C') {
        AudioFX.success();
        if (cardC) {
          cardC.style.borderColor = '#16A34A';
          cardC.style.background = '#F0FDF4';
          cardC.style.boxShadow = '4px 4px 0px #166534';
        }
      } else {
        AudioFX.error();
        if (window.event && window.event.currentTarget) {
          window.event.currentTarget.style.borderColor = '#DC2626';
          window.event.currentTarget.style.background = '#FEF2F2';
          window.event.currentTarget.style.boxShadow = '4px 4px 0px #991B1B';
        }
        if (cardC) {
          cardC.style.borderColor = '#16A34A';
          cardC.style.background = '#F0FDF4';
          cardC.style.boxShadow = '4px 4px 0px #166534';
        }
      }

      const revealBox = document.getElementById('boss-poll-reveal');
      if (revealBox) revealBox.style.display = 'block';
    },

    // =============================================================
    // SLIDE 11: GHÉP NỐI MẠCH BIỆN CHỨNG (PUZZLE GAMEPLAY THỰC SỰ)
    // =============================================================
    renderChainPool() {
      const container = document.getElementById('chain-pool-cards');
      if (!container) return;

      let html = '';
      CHAIN_CARDS.forEach(card => {
        const isPlaced = Object.values(State.chain.slots).includes(card.id);
        const isSelected = State.chain.selectedCardId === card.id;

        html += `
          <div class="chain-pool-card ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}" id="pcard-${card.id}" onclick="Deck.selectChainCard('${card.id}')">
            <img src="${card.img}" alt="${card.title}" class="pool-card-thumb">
            <div class="pool-card-name" style="margin-top: 6px;">${card.title}</div>
            <small style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">${isPlaced ? '✓ Đã ghép vào chuỗi' : 'Click để chọn thẻ'}</small>
          </div>
        `;
      });
      container.innerHTML = html;
    },

    selectChainCard(cardId) {
      AudioFX.click();
      // Nếu thẻ đã được đặt rồi thì bỏ qua
      if (Object.values(State.chain.slots).includes(cardId)) return;

      State.chain.selectedCardId = cardId;
      const card = CHAIN_CARDS.find(c => c.id === cardId);

      // Cập nhật giao diện thẻ được chọn
      document.querySelectorAll('.chain-pool-card').forEach(el => el.classList.remove('selected'));
      const el = document.getElementById(`pcard-${cardId}`);
      if (el) el.classList.add('selected');

      // Cập nhật banner hướng dẫn
      const banner = document.getElementById('chain-feedback-banner');
      if (banner) {
        banner.style.display = 'block';
        banner.style.background = '#FEF3C7';
        banner.style.borderColor = '#D97706';
        banner.style.color = '#92400E';
        banner.innerHTML = `<strong>ĐÃ CHỌN THẺ [${card.title}]</strong>. Mời bạn bấm vào 1 trong 4 ô Mắt xích bên trên để ghép vào!`;
      }
    },

    slotClicked(slotId) {
      const banner = document.getElementById('chain-feedback-banner');
      const slotEl = document.getElementById(`cslot-${slotId}`);

      // Nếu ô đã được ghép đúng rồi
      if (State.chain.slots[slotId]) {
        AudioFX.click();
        return;
      }

      // Nếu người chơi chưa chọn thẻ nào ở ngân hàng
      if (!State.chain.selectedCardId) {
        AudioFX.error();
        if (banner) {
          banner.style.display = 'block';
          banner.style.background = '#FEF3C7';
          banner.style.borderColor = '#D97706';
          banner.style.color = '#92400E';
          banner.innerHTML = `<strong>HÃY CHỌN MẢNH GHÉP TRƯỚC!</strong> Bấm vào 1 thẻ ở ngân hàng bên dưới, sau đó bấm vào ô Mắt xích này để thử ghép!`;
        }
        return;
      }

      const card = CHAIN_CARDS.find(c => c.id === State.chain.selectedCardId);

      // KIỂM TRA ĐÚNG SAI LOGIC BIỆN CHỨNG
      if (card.targetSlot === slotId) {
        // ĐÚNG LOGIC!
        AudioFX.success();
        State.chain.slots[slotId] = card.id;

        // Cập nhật giao diện ô vị trí
        slotEl.classList.add('filled');
        const dropZone = document.getElementById(`cslot-drop-${slotId}`);
        if (dropZone) {
          dropZone.innerHTML = `
            <img src="${card.img}" alt="${card.title}" class="slot-thumb-preview">
            <strong style="color: #15803D; font-size: 11px; display: block;">✓ ${card.title}</strong>
          `;
        }

        // Bỏ chọn thẻ
        State.chain.selectedCardId = null;
        this.renderChainPool();

        if (banner) {
          banner.style.display = 'block';
          banner.style.background = '#DCFCE7';
          banner.style.borderColor = '#16A34A';
          banner.style.color = '#14532D';
          banner.innerHTML = `<strong>GHÉP CHUẨN XÁC! ✓</strong> Thẻ [${card.title}] đã khớp hoàn hảo vào ${slotEl.querySelector('.slot-role-title').textContent}!`;
        }

        // Kiểm tra xem đã đủ 4/4 ô chưa
        const allFilled = Object.values(State.chain.slots).every(Boolean);
        if (allFilled) {
          AudioFX.fanfare();
          document.querySelectorAll('.chain-slot-card').forEach(s => s.classList.add('all-connected-glow'));
          if (banner) {
            banner.innerHTML = `<strong>XUẤT SẮC! TOÀN BỘ 4 MẮT XÍCH BIỆN CHỨNG ĐÃ ĐƯỢC KẾT NỐI HOÀN HẢO! ✓</strong>`;
          }
          const ultimateDest = document.getElementById('ultimate-dest');
          if (ultimateDest) {
            ultimateDest.style.display = 'block';
            ultimateDest.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        // SAI VỊ TRÍ!
        AudioFX.error();
        slotEl.classList.add('wrong-shake');
        setTimeout(() => slotEl.classList.remove('wrong-shake'), 450);

        if (banner) {
          banner.style.display = 'block';
          banner.style.background = '#FEE2E2';
          banner.style.borderColor = '#DC2626';
          banner.style.color = '#991B1B';
          banner.innerHTML = `<strong>CHƯA ĐÚNG LOGIC BIỆN CHỨNG!</strong> Thẻ "<strong>${card.title}</strong>" không thể đặt vào mắt xích này. Hãy suy ngẫm vai trò: Tiền đề xuất phát, Con đường, Mục tiêu hay Thực tiễn?`;
        }
      }
    },

    resetChainPuzzle() {
      AudioFX.click();
      State.chain.selectedCardId = null;
      State.chain.slots = { 1: null, 2: null, 3: null, 4: null };

      // Khôi phục 4 ô về trạng thái trống
      for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`cslot-${i}`);
        if (slot) {
          slot.classList.remove('filled', 'all-connected-glow', 'wrong-shake');
        }
        const dropZone = document.getElementById(`cslot-drop-${i}`);
        if (dropZone) {
          dropZone.innerHTML = `<span>[ TRỐNG // CHỌN THẺ BÊN DƯỚI ĐẶT VÀO ]</span>`;
        }
      }

      // Ẩn banner và đích đến
      const banner = document.getElementById('chain-feedback-banner');
      if (banner) banner.style.display = 'none';

      const ultimateDest = document.getElementById('ultimate-dest');
      if (ultimateDest) ultimateDest.style.display = 'none';

      this.renderChainPool();
    },

    // =============================================================
    // SLIDE 12: MINI GAME TRANH TÀI 4 NHÓM & NHẬN THƯỞNG MOMO
    // =============================================================
    initMiniGame() {
      // Xáo trộn ngẫu nhiên thứ tự 8 câu hỏi vào 8 hộp
      const qIds = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
      
      State.minigame.boxes = [];
      for (let i = 0; i < 8; i++) {
        // Điểm số ngẫu nhiên thật từ 1 đến 10 điểm theo yêu cầu
        const randomPts = Math.floor(Math.random() * 10) + 1;
        State.minigame.boxes.push({
          boxId: i + 1,
          qId: qIds[i],
          points: randomPts,
          status: 'unopened',
          winnerTeamName: ''
        });
      }
    },

    renderMiniGameBoard() {
      const sbEl = document.getElementById('mg-scoreboard');
      const bxEl = document.getElementById('mg-boxes-container');
      if (!sbEl || !bxEl) return;

      // Render Bảng điểm 4 nhóm
      let sbHtml = '';
      State.minigame.teams.forEach(team => {
        const isActive = team.id === State.minigame.selectedTeamId;
        sbHtml += `
          <div class="team-score-card ${isActive ? 'active-team' : ''}" onclick="Deck.selectMiniGameTeam(${team.id})">
            <div class="team-badge-header">
              <span>👥</span>
              <strong>${team.name}</strong>
            </div>
            <div class="team-score-val">${team.score}</div>
            <div class="team-correct-stat">Đã giải đúng: ${team.correct} câu</div>
            <div style="font-size: 11px; margin-top: 4px; color: ${isActive ? '#2563EB' : '#94A3B8'}; font-weight: 700;">
              ${isActive ? '👉 Đội đang trả lời' : 'Click để chọn đội'}
            </div>
          </div>
        `;
      });
      sbEl.innerHTML = sbHtml;

      // Render 8 Hộp câu hỏi bí ẩn
      let bxHtml = '';
      State.minigame.boxes.forEach((box, idx) => {
        if (box.status === 'completed') {
          bxHtml += `
            <div class="mg-box-card completed" title="Đã hoàn thành">
              <div class="mg-box-icon">✓</div>
              <div class="mg-box-number">HỘP 0${box.boxId}</div>
              <div style="font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 4px;">
                ${box.winnerTeamName} (+${box.points}đ)
              </div>
              <span class="mg-box-points-preview" style="background: #16A34A;">ĐÃ GIẢI MÃ</span>
            </div>
          `;
        } else if (box.status === 'skipped') {
          bxHtml += `
            <div class="mg-box-card skipped" title="Đã bỏ qua">
              <div class="mg-box-icon">✕</div>
              <div class="mg-box-number">HỘP 0${box.boxId}</div>
              <div style="font-size: 12px; color: #64748B; margin-bottom: 4px;">Chưa nhóm nào giải được</div>
              <span class="mg-box-points-preview" style="background: #64748B;">BỎ QUA (${box.points}đ)</span>
            </div>
          `;
        } else {
          bxHtml += `
            <div class="mg-box-card" onclick="Deck.openMiniGameBox(${idx})">
              <div class="mg-box-icon">🎁</div>
              <div class="mg-box-number">HỘP 0${box.boxId}</div>
              <span class="mg-box-points-preview">RANDOM: 1 - 10 ĐIỂM</span>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 6px; font-weight: 600;">
                Click để mở câu hỏi ➔
              </div>
            </div>
          `;
        }
      });
      bxEl.innerHTML = bxHtml;

      // Tự động vinh danh nếu tất cả 8 hộp đã mở xong
      const allDone = State.minigame.boxes.length === 8 && State.minigame.boxes.every(b => b.status !== 'unopened');
      if (allDone) {
        this.openVictoryPodium();
      }
    },

    openMiniGameBox(boxIdx) {
      AudioFX.click();
      const box = State.minigame.boxes[boxIdx];
      if (!box || box.status !== 'unopened') return;

      State.minigame.activeBoxIdx = boxIdx;
      const q = MINIGAME_QUESTIONS.find(item => item.id === box.qId);
      if (!q) return;

      // Chuẩn bị danh sách từ xáo trộn
      State.minigame.assembledWords = [];
      State.minigame.remainingWords = q.words.map((w, i) => ({ id: i, text: w })).sort(() => Math.random() - 0.5);
      State.minigame.isAnswerRevealed = false;

      // Cập nhật tiêu đề modal
      const titleEl = document.getElementById('mg-modal-title');
      if (titleEl) {
        titleEl.textContent = `HỘP CÂU HỎI SỐ 0${box.boxId} // CHỦ ĐỀ: ${q.topic.toUpperCase()}`;
      }

      this.renderMiniGameQuestion();
      const modal = document.getElementById('minigame-quiz-modal');
      if (modal) modal.style.display = 'flex';
    },

    renderMiniGameQuestion() {
      const bodyEl = document.getElementById('mg-quiz-modal-body');
      if (!bodyEl) return;

      const boxIdx = State.minigame.activeBoxIdx;
      if (boxIdx === null) return;
      const box = State.minigame.boxes[boxIdx];
      const q = MINIGAME_QUESTIONS.find(item => item.id === box.qId);
      if (!q) return;

      const currentTeam = State.minigame.teams.find(t => t.id === State.minigame.selectedTeamId) || State.minigame.teams[0];

      // Đội đang chọn selector
      let teamSelectorHtml = '';
      State.minigame.teams.forEach(t => {
        const isSel = t.id === State.minigame.selectedTeamId;
        teamSelectorHtml += `
          <button type="button" class="mg-team-btn ${isSel ? 'selected' : ''}" onclick="Deck.selectMiniGameTeam(${t.id})">
            ${isSel ? '👉 ' : ''}${t.name} (${t.score}đ)
          </button>
        `;
      });

      // Các từ đã ghép
      let assembledHtml = '';
      if (State.minigame.assembledWords.length === 0) {
        assembledHtml = `<span class="mg-assembled-placeholder">[ CHƯA CHỌN TỪ NÀO // CLICK CÁC TỪ BÊN DƯỚI ĐỂ XẾP THÀNH CÂU HOÀN CHỈNH ]</span>`;
      } else {
        State.minigame.assembledWords.forEach((wordObj, aIdx) => {
          assembledHtml += `
            <div class="mg-word-chip assembled" onclick="Deck.removeMiniGameWord(${aIdx})" title="Click để gỡ từ này">
              ${wordObj.text} ✕
            </div>
          `;
        });
      }

      // Các từ còn lại trong kho
      let poolHtml = '';
      if (State.minigame.remainingWords.length === 0) {
        poolHtml = `<span style="color: #64748B; font-size: 13px; font-style: italic;">(Đã xếp hết tất cả các từ vào câu)</span>`;
      } else {
        State.minigame.remainingWords.forEach((wordObj, rIdx) => {
          poolHtml += `
            <div class="mg-word-chip" onclick="Deck.selectMiniGameWord(${rIdx})" title="Click để đưa từ này lên câu">
              ${wordObj.text}
            </div>
          `;
        });
      }

      bodyEl.innerHTML = `
        <div class="mg-quiz-header">
          <div>
            <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              HỘP CÂU HỎI 0${box.boxId}
            </span>
            <div style="font-size: 13px; font-weight: 800; color: #1E40AF; margin-top: 2px;">
              ${q.topic}
            </div>
          </div>
          <div class="mg-quiz-points-badge">
            🎲 ĐIỂM THƯỞNG: +${box.points} ĐIỂM
          </div>
        </div>

        <div class="mg-question-prompt">
          ${q.prompt}
        </div>

        <div class="mg-team-selector-row">
          <strong style="font-size: 13px; color: #92400E; display: flex; align-items: center; gap: 4px;">
            <span>🎯</span> ĐỘI ĐANG GIÀNH QUYỀN TRẢ LỜI:
          </strong>
          ${teamSelectorHtml}
        </div>

        <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 13.5px; color: #1E3A8A;">CÂU TRẢ LỜI ĐANG XẾP:</strong>
          <button type="button" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;" onclick="Deck.resetMiniGameWords()">
            ↺ Xếp lại từ đầu
          </button>
        </div>

        <div class="mg-assembled-zone">
          ${assembledHtml}
        </div>

        <div style="margin-bottom: 6px;">
          <strong style="font-size: 13px; color: var(--text-secondary);">KHO TỪ CHO SẴN (CLICK TỪNG TỪ ĐỂ ĐƯA LÊN CÂU):</strong>
        </div>
        <div class="mg-words-pool">
          ${poolHtml}
        </div>

        <div id="mg-wrong-alert-box" style="display: none; background: #FEF2F2; border: 2px solid #DC2626; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; color: #991B1B; font-size: 14px; font-weight: 800;">
          <!-- Injected when wrong -->
        </div>

        ${State.minigame.isAnswerRevealed ? `
          <div class="mg-answer-reveal-box">
            <strong style="color: #065F46; display: block; margin-bottom: 4px;">✓ ĐÁP ÁN CHUẨN XÁC:</strong>
            <div style="font-size: 16px; font-weight: 800; color: #064E3B;">${q.answer}</div>
            <div style="font-size: 12px; color: #047857; margin-top: 4px;">Gợi ý: ${q.hint}</div>
          </div>
        ` : ''}

        <div class="mg-action-buttons-row">
          <button type="button" class="btn btn-secondary" style="font-size: 12.5px;" onclick="Deck.toggleMiniGameAnswer()">
            ${State.minigame.isAnswerRevealed ? 'Ẩn đáp án chuẩn' : '👁️ Xem đáp án chuẩn'}
          </button>
          <button type="button" class="btn btn-secondary" style="font-size: 12.5px; background: #F1F5F9; color: #475569;" onclick="Deck.skipMiniGameQuestion()">
            ⏭️ Bỏ qua câu này
          </button>
          <button type="button" class="btn btn-primary" style="background: #DC2626; border-color: #000;" onclick="Deck.submitMiniGameAnswer(false)">
            ✕ SAI (NHƯỜNG LƯỢT CHO ĐỘI KHÁC)
          </button>
          <button type="button" class="btn btn-primary" style="background: #16A34A; border-color: #000; font-size: 14px;" onclick="Deck.submitMiniGameAnswer(true)">
            ✓ ĐÚNG (+${box.points} ĐIỂM CHO ${currentTeam.name.toUpperCase()}) ➔
          </button>
        </div>
      `;
    },

    selectMiniGameTeam(teamId) {
      AudioFX.click();
      State.minigame.selectedTeamId = teamId;
      // Cập nhật scoreboard ngoài trang
      const sbCards = document.querySelectorAll('.team-score-card');
      State.minigame.teams.forEach((t, i) => {
        if (sbCards[i]) {
          if (t.id === teamId) {
            sbCards[i].classList.add('active-team');
          } else {
            sbCards[i].classList.remove('active-team');
          }
        }
      });
      // Nếu đang mở modal thì re-render
      const modal = document.getElementById('minigame-quiz-modal');
      if (modal && modal.style.display !== 'none') {
        this.renderMiniGameQuestion();
      }
    },

    selectMiniGameWord(rIdx) {
      AudioFX.click();
      if (rIdx >= 0 && rIdx < State.minigame.remainingWords.length) {
        const removed = State.minigame.remainingWords.splice(rIdx, 1)[0];
        State.minigame.assembledWords.push(removed);
        this.renderMiniGameQuestion();
      }
    },

    removeMiniGameWord(aIdx) {
      AudioFX.click();
      if (aIdx >= 0 && aIdx < State.minigame.assembledWords.length) {
        const removed = State.minigame.assembledWords.splice(aIdx, 1)[0];
        State.minigame.remainingWords.push(removed);
        this.renderMiniGameQuestion();
      }
    },

    resetMiniGameWords() {
      AudioFX.click();
      const boxIdx = State.minigame.activeBoxIdx;
      if (boxIdx === null) return;
      const box = State.minigame.boxes[boxIdx];
      const q = MINIGAME_QUESTIONS.find(item => item.id === box.qId);
      if (!q) return;

      State.minigame.assembledWords = [];
      State.minigame.remainingWords = q.words.map((w, i) => ({ id: i, text: w })).sort(() => Math.random() - 0.5);
      this.renderMiniGameQuestion();
    },

    toggleMiniGameAnswer() {
      AudioFX.click();
      State.minigame.isAnswerRevealed = !State.minigame.isAnswerRevealed;
      this.renderMiniGameQuestion();
    },

    submitMiniGameAnswer(isCorrect) {
      const boxIdx = State.minigame.activeBoxIdx;
      if (boxIdx === null) return;
      const box = State.minigame.boxes[boxIdx];
      const team = State.minigame.teams.find(t => t.id === State.minigame.selectedTeamId);
      if (!box || !team) return;

      if (isCorrect) {
        AudioFX.fanfare();
        team.score += box.points;
        team.correct += 1;
        box.status = 'completed';
        box.winnerTeamName = team.name;

        // Đóng modal sau 200ms và render lại bảng
        setTimeout(() => {
          this.closeMiniGameQuizModal();
          this.renderMiniGameBoard();
        }, 200);
      } else {
        // Trả lời sai: không đóng câu hỏi, thông báo nhường lượt cho đội khác
        AudioFX.error();
        const alertBox = document.getElementById('mg-wrong-alert-box');
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = `
            ✕ <strong>${team.name.toUpperCase()}</strong> trả lời chưa chính xác!
            <div style="font-weight: 500; font-size: 13px; margin-top: 2px;">
              Quyền trả lời được nhường lại cho các nhóm khác! Xin mời người điều phối bấm chọn nhóm tiếp theo ở thanh trên.
            </div>
          `;
        }
      }
    },

    skipMiniGameQuestion() {
      AudioFX.click();
      const boxIdx = State.minigame.activeBoxIdx;
      if (boxIdx === null) return;
      const box = State.minigame.boxes[boxIdx];
      if (box) {
        box.status = 'skipped';
      }
      this.closeMiniGameQuizModal();
      this.renderMiniGameBoard();
    },

    closeMiniGameQuizModal() {
      const modal = document.getElementById('minigame-quiz-modal');
      if (modal) modal.style.display = 'none';
      State.minigame.activeBoxIdx = null;
    },

    // Cài đặt mã Momo
    openMomoConfigModal() {
      AudioFX.click();
      this.updateMomoPreviews();
      const modal = document.getElementById('minigame-momo-config-modal');
      if (modal) modal.style.display = 'flex';
    },

    handleMomoUpload(rank, event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        State.minigame.momoQRs[rank] = dataUrl;
        localStorage.setItem('hcm_momo_' + rank, dataUrl);
        this.updateMomoPreviews();
        AudioFX.success();
      };
      reader.readAsDataURL(file);
    },

    getMomoQRImage(rank) {
      if (State.minigame.momoQRs[rank]) {
        return State.minigame.momoQRs[rank];
      }
      // SVG Placeholder MoMo mẫu đẹp mắt
      const label = rank === 'first' ? 'GIẢI NHẤT' : 'GIẢI NHÌ';
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" width="280" height="280">
          <rect width="280" height="280" fill="#D82D8B" rx="16"/>
          <rect x="20" y="20" width="240" height="240" fill="#FFFFFF" rx="12"/>
          <rect x="40" y="40" width="60" height="60" fill="#D82D8B"/>
          <rect x="50" y="50" width="40" height="40" fill="#FFFFFF"/>
          <rect x="60" y="60" width="20" height="20" fill="#D82D8B"/>
          <rect x="180" y="40" width="60" height="60" fill="#D82D8B"/>
          <rect x="190" y="50" width="40" height="40" fill="#FFFFFF"/>
          <rect x="200" y="60" width="20" height="20" fill="#D82D8B"/>
          <rect x="40" y="180" width="60" height="60" fill="#D82D8B"/>
          <rect x="50" y="190" width="40" height="40" fill="#FFFFFF"/>
          <rect x="60" y="200" width="20" height="20" fill="#D82D8B"/>
          <circle cx="140" cy="140" r="28" fill="#D82D8B"/>
          <text x="140" y="146" fill="#FFFFFF" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">momo</text>
          <rect x="45" y="244" width="190" height="24" fill="#000000" rx="6"/>
          <text x="140" y="260" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">MÃ THƯỞNG ${label}</text>
        </svg>
      `;
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    },

    updateMomoPreviews() {
      const p1 = document.getElementById('momo-preview-first');
      const p2 = document.getElementById('momo-preview-second');
      if (p1) {
        p1.innerHTML = `<img src="${this.getMomoQRImage('first')}" style="width: 100%; height: 100%; object-fit: contain;">`;
      }
      if (p2) {
        p2.innerHTML = `<img src="${this.getMomoQRImage('second')}" style="width: 100%; height: 100%; object-fit: contain;">`;
      }
    },

    // Bảng vinh danh & Trao thưởng
    openVictoryPodium() {
      AudioFX.fanfare();
      const panel = document.getElementById('mg-victory-arena');
      if (!panel) return;

      // Xếp hạng 4 nhóm theo điểm (và số câu đúng)
      const sorted = [...State.minigame.teams].sort((a, b) => b.score - a.score || b.correct - a.correct);

      const podiumGrid = document.getElementById('mg-podium-grid');
      if (podiumGrid) {
        let phtml = '';
        sorted.forEach((team, idx) => {
          const rankNames = ['🥇 HẠNG 1 (QUÁN QUÂN)', '🥈 HẠNG 2 (Á QUÂN)', '🥉 HẠNG 3', '🎖️ HẠNG 4'];
          const rankClasses = ['rank-1', 'rank-2', 'rank-3', 'rank-4'];
          phtml += `
            <div class="podium-card ${rankClasses[idx]}">
              <span class="momo-claim-badge" style="margin-bottom: 6px;">${rankNames[idx]}</span>
              <h3 style="font-size: 20px; font-weight: 900; margin: 4px 0;">${team.name}</h3>
              <div style="font-size: 28px; font-weight: 900; color: #0F172A;">${team.score} đ</div>
              <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 4px;">Đúng ${team.correct} câu</div>
            </div>
          `;
        });
        podiumGrid.innerHTML = phtml;
      }

      // Cập nhật 2 ô nhận thưởng MoMo
      const t1 = sorted[0];
      const t2 = sorted[1];
      const title1 = document.getElementById('momo-title-first');
      const title2 = document.getElementById('momo-title-second');
      if (title1 && t1) title1.textContent = `${t1.name.toUpperCase()} (${t1.score} ĐIỂM)`;
      if (title2 && t2) title2.textContent = `${t2.name.toUpperCase()} (${t2.score} ĐIỂM)`;

      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth' });
    },

    openMomoRewardModal(rank) {
      AudioFX.fanfare();
      const sorted = [...State.minigame.teams].sort((a, b) => b.score - a.score || b.correct - a.correct);
      const team = rank === 'first' ? sorted[0] : sorted[1];
      if (!team) return;

      const badge = document.getElementById('mg-reward-modal-badge');
      const heading = document.getElementById('mg-reward-team-heading');
      const qrBox = document.getElementById('mg-reward-qr-box');

      if (badge) badge.textContent = rank === 'first' ? '🥇 PHẦN THƯỞNG GIẢI NHẤT MOMO' : '🥈 PHẦN THƯỞNG GIẢI NHÌ MOMO';
      if (heading) heading.textContent = `CHÚC MỪNG ${team.name.toUpperCase()}!`;
      if (qrBox) {
        qrBox.innerHTML = `
          <img src="${this.getMomoQRImage(rank)}" alt="Mã QR MoMo ${rank}">
          <div style="margin-top: 10px; font-weight: 800; font-size: 15px; color: #831843;">
            MÃ NHẬN THƯỞNG MOMO: ${rank === 'first' ? 'GIẢI NHẤT' : 'GIẢI NHÌ'}
          </div>
        `;
      }

      const modal = document.getElementById('minigame-momo-reward-modal');
      if (modal) modal.style.display = 'flex';
    },

    resetMiniGame() {
      AudioFX.click();
      State.minigame.teams.forEach(t => {
        t.score = 0;
        t.correct = 0;
      });
      State.minigame.selectedTeamId = 1;
      this.initMiniGame();
      const panel = document.getElementById('mg-victory-arena');
      if (panel) panel.style.display = 'none';
      this.renderMiniGameBoard();
    }
  };
})();

// Khởi chạy hệ thống bài thuyết trình khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  Deck.init();
});
