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
    totalSlides: 14,

    // Chặng 1: Thảo (3.1.1)
    lv1: {
      clues: [false, false, false, false],
      quizStatus: { 1: null, 2: null, 3: null, 4: null },
      currentCardPage: { 1: 0, 2: 0, 3: 0, 4: 0 }
    },

    // Chặng 2: Thịnh (3.1.2)
    lv2: {
      choices: {}
    },

    // Chặng 3: Vinh (3.2.1)
    lv3: {
      pol: 0, eco: 0, cul: 0, soc: 0, built: false
    },

    // Chặng 4: Tân (3.2.2)
    lv4: {
      currentIdx: 1
    },

    // Tổng kết & Tranh luận: Ánh
    boss: {
      pollSelected: null
    },

    // Slide 11: Ghép nối chuỗi biện chứng
    chain: {
      selectedCardId: null,
      slots: { 1: null, 2: null, 3: null, 4: null }
    }
  };

  // --- DỮ LIỆU CHẶNG 1: BẢN ĐỒ TƯ LIỆU LỊCH SỬ (THẢO - 3.1.1) ---
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
      caption: "Bác Hồ thăm lớp Bình dân học vụ (1945) — Diệt giặc đói, diệt giặc dốt, chăm lo hạnh phúc nhân dân",
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
      img: "assets/images/116092019102930.jpg?v=20260913_2",
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
      img: "assets/images/hotspot4_unification.jpg",
      caption: "Khát vọng non sông liền một dải — Đôi bờ Hiền Lương & Thư gửi đồng bào Nam Bộ (1946)",
      quote: "“Đồng bào Nam Bộ là dân nước Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý đó không bao giờ thay đổi!” — Hồ Chí Minh",
      videoSrc: "assets/images/video.mp4",
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
  const STRATEGIES = {
    1: {
      name: "CON ĐƯỜNG // CÁCH MẠNG VÔ SẢN",
      img: "assets/images/strat1_tours1920.jpg",
      caption: "Nguyễn Ái Quốc tại Đại hội Tours (12/1920) — Tìm ra con đường cứu nước theo cách mạng vô sản",
      q1: "Việt Nam nên lựa chọn con đường cứu nước nào để giải phóng dân tộc triệt để?",
      opts1: [
        { key: "A", text: "Con đường phong kiến (tiêu biểu như phong trào Cần Vương)" },
        { key: "B", text: "Con đường dân chủ tư sản (tiêu biểu như phong trào Đông Du, Duy Tân)" },
        { key: "C", text: "Con đường cách mạng vô sản (gắn độc lập dân tộc với chủ nghĩa xã hội)", correct: true }
      ],
      q2: "Luận cứ giải thích cốt lõi của Hồ Chí Minh cho sự lựa chọn con đường cách mạng vô sản?",
      opts2: [
        { key: "A", text: "Các con đường phong kiến, tư sản đều bế tắc và thất bại; chỉ có CMVS mới giải phóng triệt để cả dân tộc, giai cấp và con người.", correct: true },
        { key: "B", text: "Chỉ vì phong trào cộng sản quốc tế yêu cầu mà không xuất phát từ điều kiện cụ thể của Việt Nam." },
        { key: "C", text: "Muốn dựa hoàn toàn vào viện trợ quân sự trực tiếp của nước ngoài." }
      ],
      summary: "Đường lối: Cách mạng vô sản — Giải phóng dân tộc triệt để gắn liền với CNXH"
    },
    2: {
      name: "LỰC LƯỢNG // ĐẠI ĐOÀN KẾT TOÀN DÂN",
      img: "assets/images/strat2_doanket.jpg",
      caption: "Khối đại đoàn kết toàn dân tộc — Cách mạng là sự nghiệp của toàn dân, lấy liên minh công - nông làm gốc",
      q1: "Lực lượng của cách mạng giải phóng dân tộc theo Hồ Chí Minh bao gồm những ai?",
      opts1: [
        { key: "A", text: "Chỉ riêng giai cấp công nhân công nghiệp" },
        { key: "B", text: "Toàn thể nhân dân, toàn dân tộc, lấy liên minh CÔNG - NÔNG làm gốc", correct: true },
        { key: "C", text: "Chỉ gồm tầng lớp sĩ phu và nhân sĩ trí thức tinh hoa" }
      ],
      q2: "Luận cứ lý giải sâu sắc nhất của Người về lực lượng cách mạng trong tác phẩm 'Đường cách mệnh'?",
      opts2: [
        { key: "A", text: "Cách mạng là sự nghiệp của toàn dân chúng, không phải việc của một hai người anh hùng cá nhân.", correct: true },
        { key: "B", text: "Chỉ cần kêu gọi tinh thần yêu nước tự phát mà không cần xây dựng khối liên minh công nông vững chắc." },
        { key: "C", text: "Chờ đợi sự giúp đỡ của lực lượng quân tình nguyện bên ngoài." }
      ],
      summary: "Lực lượng: Toàn thể dân tộc, lấy liên minh công - nông làm gốc rễ nền tảng"
    },
    3: {
      name: "LÃNH ĐẠO // ĐẢNG CỘNG SẢN VIỆT NAM",
      img: "assets/images/strat3_duongkachmenh.jpg",
      caption: "Tác phẩm Đường Kách Mệnh (1927) — 'Cách mệnh trước hết phải có Đảng cách mệnh để trong thì vận động, ngoài thì liên lạc'",
      q1: "Lực lượng chính trị nào giữ vai trò lãnh đạo cách mạng giải phóng dân tộc Việt Nam?",
      opts1: [
        { key: "A", text: "Một ủy ban cố vấn quân sự độc lập" },
        { key: "B", text: "Đảng Cộng sản Việt Nam — đội tiền phong của giai cấp công nhân và nhân dân lao động", correct: true },
        { key: "C", text: "Các hội đồng hương và hội đoàn tự phát" }
      ],
      q2: "Luận điểm bất hủ trong tác phẩm 'Đường cách mệnh' (1927) lý giải điều này?",
      opts2: [
        { key: "A", text: "“Cách mệnh trước hết phải có Đảng cách mệnh, để trong thì vận động và tổ chức dân chúng, ngoài thì liên lạc với vô sản...”", correct: true },
        { key: "B", text: "Không cần có Đảng vì phong trào tự phát của quần chúng sẽ tự khắc giành thắng lợi." },
        { key: "C", text: "Đảng chỉ cần thành lập sau khi đất nước đã giành được độc lập hoàn toàn." }
      ],
      summary: "Lãnh đạo: Đảng Cộng sản Việt Nam — Đội tiền phong giác ngộ và tổ chức quần chúng"
    },
    4: {
      name: "PHƯƠNG PHÁP // BẠO LỰC CÁCH MẠNG",
      img: "assets/images/strat4_vnttgpq.jpg",
      caption: "Đội Việt Nam Tuyên truyền Giải phóng quân (1944) — Bạo lực cách mạng kết hợp đấu tranh chính trị và vũ trang",
      q1: "Phương pháp chủ yếu để đập tan bạo lực phản cách mạng hung hãn của thực dân?",
      opts1: [
        { key: "A", text: "Sử dụng bạo lực cách mạng: Kết hợp nhuần nhuyễn đấu tranh CHÍNH TRỊ và VŨ TRANG", correct: true },
        { key: "B", text: "Thương lượng đàm phán thuần túy, tuyệt đối không dùng lực lượng vũ trang" },
        { key: "C", text: "Khủng bố cá nhân nhắm vào các quan chức thực dân đơn lẻ" }
      ],
      q2: "Bác Hồ giải thích mối quan hệ biện chứng giữa đấu tranh chính trị và vũ trang như thế nào?",
      opts2: [
        { key: "A", text: "Đấu tranh chính trị của quần chúng là cơ sở, là gốc để xây dựng và phát triển lực lượng vũ trang.", correct: true },
        { key: "B", text: "Vũ trang là tất cả, không cần quan tâm đến công tác giác ngộ chính trị quần chúng." },
        { key: "C", text: "Chính trị và vũ trang hoàn toàn độc lập và bài xích lẫn nhau." }
      ],
      summary: "Phương pháp: Bạo lực cách mạng — Kết hợp chặt chẽ đấu tranh chính trị và vũ trang"
    },
    5: {
      name: "TÍNH CHỦ ĐỘNG // KHẢ NĂNG THẮNG TRƯỚC",
      img: "assets/images/strat5_leparia.jpg",
      caption: "Báo Le Paria (Người cùng khổ - 1922) — Luận điểm sáng tạo: Cách mạng thuộc địa có thể chủ động thắng trước chính quốc",
      q1: "Cách mạng thuộc địa có cần thụ động chờ đợi cách mạng vô sản ở chính quốc nổ ra trước không?",
      opts1: [
        { key: "A", text: "Có, vì thuộc địa chỉ là bộ phận phụ thuộc hoàn toàn vào chính quốc" },
        { key: "B", text: "Không! Thuộc địa có thể chủ động tiến hành và có khả năng giành thắng lợi trước chính quốc", correct: true },
        { key: "C", text: "Chỉ tiến hành các cuộc bãi công nhỏ đòi cải thiện quyền lợi sinh hoạt" }
      ],
      q2: "Hình tượng sáng tạo xuất sắc nào của Bác chứng minh luận điểm này?",
      opts2: [
        { key: "A", text: "Hình tượng 'Con đỉa hai vòi': Thuộc địa là nguồn sống béo bở nuôi đế quốc; chặt đứt vòi thuộc địa sẽ làm đế quốc suy sụp và cách mạng thắng lợi trước!", correct: true },
        { key: "B", text: "Hình tượng chiếc lá vàng rơi mùa thu trôi theo dòng nước." },
        { key: "C", text: "Hình tượng cỗ xe ngựa chạy trên đường bằng phẳng." }
      ],
      summary: "Tính chủ động: Hình tượng con đỉa hai vòi — Khả năng chủ động giành thắng lợi trước chính quốc"
    }
  };

  // --- DỮ LIỆU CHẶNG 4: 4 BÀI TOÁN THỰC TIỄN VIỆT NAM (TÂN - 3.2.2) ---
  const CHALLENGES = {
    1: {
      badge: "THỬ THÁCH 01 // BỐI CẢNH LỊCH SỬ",
      img: "assets/images/ch1_nongnghiep.jpg",
      caption: "Cảnh nông thôn miền Bắc thời kỳ đầu khôi phục kinh tế — Xuất phát điểm nước nông nghiệp lạc hậu bỏ qua TBCN",
      title: "Đặc Điểm Lớn Nhất Của Thời Kỳ Quá Độ Lên CNXH Ở Việt Nam?",
      desc: "Việt Nam bước vào công cuộc xây dựng CNXH trong hoàn cảnh lịch sử vô cùng đặc biệt. Bạn xác định đặc điểm bao trùm là gì?",
      options: [
        { key: "A", text: "Đã có nền đại công nghiệp phát triển và cơ sở vật chất kỹ thuật dồi dào từ trước." },
        { key: "B", text: "Từ một nước nông nghiệp lạc hậu tiến thẳng lên CNXH, bỏ qua giai đoạn phát triển tư bản chủ nghĩa.", correct: true },
        { key: "C", text: "Chỉ cần sao chép y nguyên lộ trình của các quốc gia công nghiệp phát triển ở châu Âu." }
      ],
      feedback: "HOÀN TOÀN CHUẨN XÁC! Đây chính là đặc điểm to lớn nhất chi phối toàn bộ bước đi, hình thức và biện pháp xây dựng CNXH tại Việt Nam."
    },
    2: {
      badge: "THỬ THÁCH 02 // CƠ CẤU KINH TẾ",
      img: "assets/images/ch2_cong_nong.jpg",
      caption: "Công nhân và nông dân liên kết sản xuất — Lấy nông nghiệp làm mặt trận hàng đầu, công nghiệp phục vụ nông nghiệp",
      title: "Xử Lý Mối Quan Hệ Giữa Nông Nghiệp Và Công Nghiệp Ra Sao?",
      desc: "Trong bối cảnh đất nước vừa thoát khỏi chiến tranh, đa số người dân sống dựa vào nông nghiệp.",
      options: [
        { key: "A", text: "Tập trung toàn lực phát triển công nghiệp nặng ngay lập tức, bỏ qua nông thôn." },
        { key: "B", text: "Lấy nông nghiệp làm mặt trận hàng đầu, phục vụ đời sống dân sinh và làm tiền đề phát triển công nghiệp.", correct: true },
        { key: "C", text: "Chỉ phát triển thương mại dịch vụ tiêu dùng đơn thuần." }
      ],
      feedback: "CHÍNH XÁC! Bác chỉ rõ: 'Nông nghiệp là mặt trận hàng đầu'; công nghiệp và nông nghiệp là hai chân của nền kinh tế, phải bước đều nhau."
    },
    3: {
      badge: "THỬ THÁCH 03 // ĐỘNG LỰC CON NGƯỜI",
      img: "assets/images/ch3_dongluc.jpg",
      caption: "Phong trào thi đua yêu nước — Bác Hồ gặp mặt các đại biểu anh hùng chiến sĩ thi đua toàn quốc",
      title: "Đâu Là Động Lực Quyết Định Thúc Đẩy Nhân Dân Thi Đua Xây Dựng?",
      desc: "Chính sách được đề ra nhưng người dân chưa thực sự hăng hái tham gia sản xuất.",
      options: [
        { key: "A", text: "Chỉ áp dụng mệnh lệnh hành chính ép buộc và xử phạt nghiêm ngặt." },
        { key: "B", text: "Kết hợp hài hòa giữa lợi ích tập thể và lợi ích thiết thực của người lao động; phát huy quyền làm chủ của nhân dân.", correct: true },
        { key: "C", text: "Trông chờ hoàn toàn vào sự chi viện từ các tổ chức bên ngoài." }
      ],
      feedback: "CHUẨN XÁC! Trong tư tưởng Bác, nhân dân vừa là mục tiêu vừa là động lực quyết định. Phải chăm lo lợi ích thiết thực của người lao động."
    },
    4: {
      badge: "THỬ THÁCH 04 // PHƯƠNG CHÂM & BÀI HỌC",
      img: "assets/images/ch4_tietkiem.jpg",
      caption: "Bác Hồ làm việc giản dị tại nhà sàn Hà Nội — Tấm gương mẫu mực về Cần, Kiệm, Liêm, Chính, chống giặc nội xâm",
      title: "Phương Châm Hành Động Và Bài Học Chống 'Giặc Nội Xâm'?",
      desc: "Để bảo vệ thành quả cách mạng và giữ vững niềm tin của nhân dân đối với chế độ mới.",
      options: [
        { key: "A", text: "Chủ quan nóng vội, đốt cháy giai đoạn và che giấu các biểu hiện quan liêu tiêu cực." },
        { key: "B", text: "Tiến dần từng bước vững chắc; kiên quyết chống tham ô, lãng phí, quan liêu — thứ 'giặc nội xâm' nguy hiểm.", correct: true },
        { key: "C", text: "Chỉ chú trọng phát triển kinh tế mà buông lỏng việc giáo dục đạo đức cán bộ đảng viên." }
      ],
      feedback: "XUẤT SẮC! Bác dạy: Xây dựng CNXH phải 'dần dần, thận trọng, từng bước', đồng thời phải quét sạch nạn tham ô, lãng phí, quan liêu."
    }
  };

  // --- DỮ LIỆU SLIDE 11: GHÉP NỐI MẠCH BIỆN CHỨNG ---
  const CHAIN_CARDS = [
    {
      id: "c-321",
      targetSlot: 3,
      code: "Mục 3.2.1",
      title: "CHỦ NGHĨA XÃ HỘI",
      img: "assets/images/pillar_eco_nhamay.jpg",
      role: "Mục tiêu lý tưởng & Đích đến bảo vệ độc lập"
    },
    {
      id: "c-311",
      targetSlot: 1,
      code: "Mục 3.1.1",
      title: "ĐỘC LẬP DÂN TỘC",
      img: "assets/images/hotspot1_1919.jpg",
      role: "Tiền đề xuất phát & Quyền thiêng liêng"
    },
    {
      id: "c-322",
      targetSlot: 4,
      code: "Mục 3.2.2",
      title: "XÂY DỰNG TẠI VN",
      img: "assets/images/ch2_cong_nong.jpg",
      role: "Vận dụng thực tiễn & Bước đi thận trọng"
    },
    {
      id: "c-312",
      targetSlot: 2,
      code: "Mục 3.1.2",
      title: "CÁCH MẠNG GPDT",
      img: "assets/images/strat4_vnttgpq.jpg",
      role: "Con đường vô sản & Bạo lực cách mạng"
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
        const slideMap = [0, 2, 4, 6, 8, 10, 12, 13];
        if (slideMap[idx] === index || (idx > 0 && index >= slideMap[idx] && (idx === slideMap.length - 1 || index < slideMap[idx + 1]))) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
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
          return;
        }

        if (isModalOpen) return;

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

    // Điều khiển video thông minh
    toggleVideoPlay(videoId) {
      const vid = document.getElementById(videoId);
      const btn = document.getElementById('btn-video-toggle');
      const status = document.getElementById('video-status-text');
      if (!vid) return;

      if (vid.paused) {
        vid.play().catch(() => {});
        if (btn) btn.textContent = 'Tạm dừng video';
        if (status) status.textContent = 'Đang phát video tư liệu lịch sử';
      } else {
        vid.pause();
        if (btn) btn.textContent = 'Phát tiếp video';
        if (status) status.textContent = 'Đã tạm dừng video';
      }
    },

    restartVideo(videoId) {
      const vid = document.getElementById(videoId);
      if (!vid) return;
      vid.currentTime = 0;
      vid.play().catch(() => {});
      const btn = document.getElementById('btn-video-toggle');
      const status = document.getElementById('video-status-text');
      if (btn) btn.textContent = 'Tạm dừng video';
      if (status) status.textContent = 'Đang phát lại từ đầu';
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
            <div class="video-smart-card" style="background: #0B0F19; border-radius: 8px; overflow: hidden; margin-bottom: 14px; border: 2px solid var(--border-dark); box-shadow: var(--shadow-sm);">
              <video id="hotspot-video-player" playsinline preload="metadata" controls style="width: 100%; max-height: 400px; display: block; background: #000; cursor: pointer;" onclick="Deck.toggleVideoPlay('hotspot-video-player')">
                <source src="${data.videoSrc}" type="video/mp4">
                Trình duyệt không hỗ trợ phát video MP4.
              </video>
              <div class="video-smart-toolbar" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; background: #1E293B; border-top: 1px solid #334155;">
                <button type="button" id="btn-video-toggle" class="btn btn-primary" style="font-size: 13px; font-weight: 700; padding: 6px 16px; background: var(--accent-orange); color: #000; border-color: #000; box-shadow: 2px 2px 0px #000;" onclick="Deck.toggleVideoPlay('hotspot-video-player')">
                  Phát video
                </button>
                <span id="video-status-text" style="font-size: 13px; color: #CBD5E1; font-weight: 600; flex: 1; text-align: center;">
                  Bấm để bật hoặc tạm dừng video
                </span>
                <button type="button" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px; background: #334155; color: #FFF; border-color: #475569;" onclick="Deck.restartVideo('hotspot-video-player')">
                  Xem lại từ đầu
                </button>
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
            const vid = document.getElementById('hotspot-video-player');
            const btn = document.getElementById('btn-video-toggle');
            const status = document.getElementById('video-status-text');
            if (vid && btn && status) {
              vid.onplay = () => {
                btn.textContent = 'Tạm dừng video';
                status.textContent = 'Đang phát video tư liệu lịch sử';
              };
              vid.onpause = () => {
                btn.textContent = 'Phát tiếp video';
                status.textContent = 'Đã tạm dừng video';
              };
              vid.onended = () => {
                btn.textContent = 'Phát lại video';
                status.textContent = 'Video đã kết thúc';
              };
            }
          }, 50);
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
        fb.innerHTML = `
          <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 6px;">✓ Chính xác! Bạn đã tìm ra manh mối quan trọng.</strong>
          <span style="color: #14532D; font-size: 13px;">Hãy cùng khám phá nội dung bài học để hiểu rõ hơn nhé!</span>
          <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="Deck.renderHotspotStep(${hpId}, 3, 0)">
            TIẾP TỤC: KHÁM PHÁ BÀI HỌC (BƯỚC 3) ➔
          </button>
        `;
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
      this.renderStrategyStep(nodeId, 1);
    },

    renderStrategyStep(nodeId, step) {
      const data = STRATEGIES[nodeId];
      const badgeEl = document.getElementById('m2-badge');
      if (badgeEl) badgeEl.textContent = `QUYẾT SÁCH 0${nodeId} // ${data.name}`;
      const content = document.getElementById('m2-content');
      if (!content) return;

      const stepPills = `
        <div class="modal-step-flow">
          <span class="modal-step-badge ${step === 1 ? 'active' : 'done'}">CÂU 1: CHỌN QUYẾT SÁCH CHIẾN LƯỢC</span>
          <span class="modal-step-badge ${step === 2 ? 'active' : ''}">CÂU 2: CHỌN LUẬN CỨ GIẢI THÍCH</span>
        </div>
      `;

      // Ảnh tư liệu lịch sử cho quyết sách
      const imageBlock = `
        <div class="inspect-img-wrap" style="height: 180px; margin-bottom: 8px;">
          <img src="${data.img}" alt="${data.caption}" class="inspect-img">
        </div>
        <div style="font-style: italic; font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
          <strong>Tư liệu lịch sử:</strong> ${data.caption}
        </div>
      `;

      if (step === 1) {
        let optsHtml = '';
        data.opts1.forEach(opt => {
          optsHtml += `
            <button class="stage-opt-btn" onclick="Deck.pickStrategyStep1(${nodeId}, '${opt.key}', ${opt.correct || false}, this)">
              <span class="brutal-badge badge-green">${opt.key}</span>
              <span>${opt.text}</span>
            </button>
          `;
        });

        content.innerHTML = `
          ${stepPills}
          ${imageBlock}
          <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 14px; line-height: 1.4;">${data.q1}</h3>
          <div class="stage-options-grid">${optsHtml}</div>
          <div id="strat-fb" style="display: none; margin-top: 14px;"></div>
        `;
      } else if (step === 2) {
        let optsHtml = '';
        data.opts2.forEach(opt => {
          optsHtml += `
            <button class="stage-opt-btn" onclick="Deck.pickStrategyStep2(${nodeId}, '${opt.key}', ${opt.correct || false}, this)">
              <span class="brutal-badge badge-purple">${opt.key}</span>
              <span>${opt.text}</span>
            </button>
          `;
        });

        content.innerHTML = `
          ${stepPills}
          ${imageBlock}
          <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #065F46;">
            ✓ Bạn đã chọn quyết sách đúng! Bây giờ hãy chọn luận cứ giải thích chuẩn xác theo tư tưởng Bác:
          </div>
          <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 14px; line-height: 1.4;">${data.q2}</h3>
          <div class="stage-options-grid">${optsHtml}</div>
          <div id="strat-fb" style="display: none; margin-top: 14px;"></div>
        `;
      }
    },

    pickStrategyStep1(nodeId, key, isCorrect, btnEl) {
      const fb = document.getElementById('strat-fb');
      if (!fb) return;

      if (isCorrect) {
        AudioFX.success();
        btnEl.classList.add('correct');
        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong>QUYẾT SÁCH HOÀN TOÀN CHÍNH XÁC! ✓</strong><br>
          <button class="btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="Deck.renderStrategyStep(${nodeId}, 2)">
            TIẾP TỤC: CHỌN LUẬN CỨ GIẢI THÍCH (CÂU 2) ➔
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEE2E2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `<strong>LỰA CHỌN CHƯA PHÙ HỢP!</strong> Vui lòng xem lại bài học lịch sử và chọn lại đường lối đúng đắn.`;
      }
    },

    pickStrategyStep2(nodeId, key, isCorrect, btnEl) {
      const fb = document.getElementById('strat-fb');
      if (!fb) return;
      const data = STRATEGIES[nodeId];

      if (isCorrect) {
        AudioFX.fanfare();
        btnEl.classList.add('correct');
        State.lv2.choices[nodeId] = key;

        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong>LUẬN CỨ HOÀN TOÀN CHUẨN XÁC! ✓</strong><br>
          <div style="margin-top: 4px; font-size: 13px; color: #166534;">${data.summary}</div>
          <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="Deck.confirmStrategyChoice(${nodeId})">
            XÁC NHẬN VÀO BẢNG CHIẾN LƯỢC ➔
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEE2E2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `<strong>LUẬN CỨ CHƯA ĐÚNG!</strong> Hãy liên hệ quan điểm của Chủ tịch Hồ Chí Minh trong giáo trình.`;
      }
    },

    confirmStrategyChoice(nodeId) {
      AudioFX.click();
      const card = document.getElementById(`scard-${nodeId}`);
      if (card) card.classList.add('selected');
      const choiceEl = document.getElementById(`schoice-${nodeId}`);
      if (choiceEl) choiceEl.innerHTML = `<strong>✓ ĐÃ THIẾT LẬP</strong>`;

      const completed = Object.keys(State.lv2.choices).length;
      const countEl = document.getElementById('lv2-stat-count');
      if (countEl) countEl.textContent = `${completed} / 5`;

      this.closeModal('lv2-modal');

      if (completed === 5) {
        AudioFX.fanfare();
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

      // 1. Trạng thái ban đầu: Tổng 0
      if (total === 0) {
        title.textContent = 'HỆ THỐNG CHỜ PHÂN BỔ NGUỒN LỰC';
        badge.className = 'sim-status-badge pending';
        badge.textContent = 'CHƯA PHÂN BỔ ĐỦ 100 ĐNL';
        desc.innerHTML = 'Kéo các thanh trượt bên trái hoặc bấm vào các nút kịch bản thử nghiệm để quan sát hệ thống phân tích và đánh giá phản hồi ngay lập tức.';
        this.setBars(0, 0, 0, 0);
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

        const estPol = Math.min(95, Math.round(pol * 1.8 + soc * 0.4));
        const estEco = Math.min(95, Math.round(eco * 2.0));
        const estCul = Math.min(95, Math.round(cul * 2.2));
        const estSoc = Math.min(95, Math.round(soc * 1.8 + eco * 0.3));
        this.setBars(estPol, estEco, estCul, estSoc);

        if (actionBtn) {
          actionBtn.className = 'btn btn-secondary btn-full';
          actionBtn.innerHTML = `CẦN PHÂN BỔ VỪA ĐÚNG 100 ĐNL (ĐANG CÓ: ${total}/100)`;
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = `[ XÁC NHẬN MÔ HÌNH XÃ HỘI (${total}/100 ĐNL) ➔ ]`;
        }
        return;
      }

      // 3. Đúng 100 ĐNL: Đánh giá Ma trận Đánh đổi
      if (eco >= 55) {
        title.textContent = 'DỒN HẾT CHO KINH TẾ — BỎ QUÊN CÔNG BẰNG XÃ HỘI';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = '<strong>Thực tế sẽ ra sao?</strong> Của cải làm ra nhiều nhưng người giàu thì ngày càng giàu, người nghèo thì chịu thiệt thòi; thiếu công bằng xã hội, đạo đức và tình nghĩa giữa con người bị xem nhẹ khi ai nấy chỉ mải chạy theo tiền bạc.<br><em><strong>Lời Bác dạy:</strong> Kinh tế phải phát triển vững vàng, nhưng thành quả làm ra phải đem lại ấm no cho tất cả mọi người, chứ không thể để số ít giàu sang còn đa số chịu vất vả.</em>';
        this.setBars(35, 95, 25, 30);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ DỒN TIỀN LÀM KINH TẾ (CHƯA ĐẠT) ]';
      }
      else if (soc >= 55) {
        title.textContent = 'CHƯA LÀM ĐÃ LO CHIA ĐỀU — CÙNG NHAU NGHÈO ĐI';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = '<strong>Thực tế sẽ ra sao?</strong> Khi chưa làm ra nhiều của cải mà đã lo chia đều tiền của và trợ cấp. Người chăm chỉ cũng hưởng bằng người lười biếng, sinh ra thói ỷ lại, người tài không còn động lực phấn đấu, cuối cùng đất nước cạn kiệt ngân sách và cùng nhau nghèo đi.<br><em><strong>Lời Bác dạy:</strong> Bác khẳng định nguyên tắc công bằng rất rõ ràng: "Làm nhiều hưởng nhiều, làm ít hưởng ít, không làm không hưởng". Phải cùng nhau lao động sản xuất tạo ra của cải trước thì mới có cái để chăm lo cuộc sống ấm no cho dân.</em>';
        this.setBars(50, 20, 40, 45);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ CHƯA LÀM ĐÃ LO CHIA ĐỀU (CHƯA ĐẠT) ]';
      }
      else if (pol >= 55) {
        title.textContent = 'BỘ MÁY QUẢN LÝ QUÁ CỒNG KỀNH — XA RỜI NGƯỜI DÂN';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = '<strong>Thực tế sẽ ra sao?</strong> Tiêu tốn quá nhiều tiền của vào bộ máy quản lý bàn giấy cồng kềnh. Cán bộ xa dân, chỉ biết ngồi phòng lạnh ra lệnh áp đặt từ trên xuống mà không lắng nghe dân, làm thui chột tinh thần chủ động và sáng tạo của người dân.<br><em><strong>Lời Bác dạy:</strong> Bác căn dặn: "Cán bộ là người đầy tớ phục vụ nhân dân, chứ không phải quan cách mạng để đè đầu cưỡi cổ dân". Xã hội muốn phát triển thì mọi việc phải để người dân tự giác bàn bạc, thực hiện và kiểm tra.</em>';
        this.setBars(45, 25, 35, 25);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ BỘ MÁY QUẢN LÝ CỒNG KỀNH (CHƯA ĐẠT) ]';
      }
      else if (cul >= 55) {
        title.textContent = 'CHỈ NÓI ĐẠO LÝ SUÔNG — THIẾU CƠM ĂN ÁO MẶC';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'CẢNH BÁO MẤT CÂN ĐỐI ✕';
        desc.innerHTML = '<strong>Thực tế sẽ ra sao?</strong> Suốt ngày chỉ mở lớp học lý thuyết và kêu gọi đạo đức suông nhưng bỏ quên việc làm ăn sản xuất. Khi người dân còn đói ăn, thiếu mặc thì những lời đạo lý suông không thể giúp cuộc sống tốt đẹp hơn.<br><em><strong>Lời Bác dạy:</strong> Bác nhắc nhở chân lý rất mộc mạc: "Có thực mới vực được đạo" — Muốn nhân dân tin tưởng và yên tâm xây dựng đời sống mới, trước hết chính quyền phải lo cho dân có đủ cơm ăn, áo ấm và chỗ ở đàng hoàng.</em>';
        this.setBars(40, 20, 85, 35);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ PHÂN BỔ BỊ LỆCH — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '[ CHỈ NÓI ĐẠO LÝ SUÔNG (CHƯA ĐẠT) ]';
      }
      else if (eco >= 20 && eco <= 40 && pol >= 15 && pol <= 35 && cul >= 15 && cul <= 30 && soc >= 20 && soc <= 35) {
        title.textContent = 'MÔ HÌNH HÀI HÒA THEO ĐÚNG TƯ TƯỞNG BÁC HỒ';
        badge.className = 'sim-status-badge success';
        badge.textContent = 'XUẤT SẮC: PHÁT TRIỂN TOÀN DIỆN & BỀN VỮNG ✓';
        desc.innerHTML = '<strong>Bài học cốt lõi từ Bác:</strong> Phát triển đất nước phải kết hợp nhịp nhàng cả 4 mặt:<br>• <strong>Chính trị:</strong> Nhân dân thực sự làm chủ, chính quyền gần gũi và vì dân phục vụ.<br>• <strong>Kinh tế:</strong> Lao động sản xuất giỏi để đất nước giàu có, no đủ của cải.<br>• <strong>Văn hóa:</strong> Mở mang trường học, nâng cao hiểu biết và sống có đạo đức.<br>• <strong>Xã hội:</strong> Công bằng, chăm lo y tế, giúp đỡ người nghèo, không ai bị bỏ rơi.';
        this.setBars(90, 85, 85, 95);
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
        desc.innerHTML = 'Bốn trụ cột đang bị lệch. Gợi ý từ Bác Hồ: Hãy đầu tư Kinh tế làm nền tảng (khoảng 25–35 điểm), giữ Chính trị dân chủ vì dân (20–30 điểm), bồi dưỡng Văn hóa con người (15–25 điểm) và chăm lo Đời sống xã hội (20–30 điểm).';
        this.setBars(Math.min(pol + 20, 75), Math.min(eco + 20, 75), Math.min(cul + 20, 75), Math.min(soc + 20, 75));
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

      if (mbPol) mbPol.textContent = `${p}%`;
      if (bfPol) bfPol.style.width = `${p}%`;
      if (mbEco) mbEco.textContent = `${e}%`;
      if (bfEco) bfEco.style.width = `${e}%`;
      if (mbCul) mbCul.textContent = `${c}%`;
      if (bfCul) bfCul.style.width = `${c}%`;
      if (mbSoc) mbSoc.textContent = `${s}%`;
      if (bfSoc) bfSoc.style.width = `${s}%`;
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
        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong>QUYẾT SÁCH CHÍNH XÁC! ✓</strong><br>
          <span>${data.feedback}</span><br>
          <button class="btn btn-primary" style="margin-top: 12px;" onclick="Deck.nextChallenge(${chId})">
            ${chId < 4 ? 'TIẾP TỤC THỬ THÁCH TIẾP THEO ➔' : 'HOÀN THÀNH ➔ XEM TỔNG HỢP NGUYÊN TẮC CỐT LÕI ➔'}
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEE2E2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `<strong>CHƯA PHÙ HỢP!</strong> Quyết sách này có nguy cơ nóng vội, đốt cháy giai đoạn hoặc giáo điều. Hãy chọn lại!`;
      }
    },

    nextChallenge(currentId) {
      AudioFX.click();
      if (currentId < 4) {
        this.renderChallengeStage(currentId + 1);
      } else {
        this.goToSlide(9); // Slide 9 là Đúc kết Mục 3.2.2
      }
    },

    // =============================================================
    // TỔNG KẾT & TRANH LUẬN (ÁNH)
    // =============================================================
    selectBossPoll(optKey) {
      AudioFX.success();
      State.boss.pollSelected = optKey;
      document.querySelectorAll('.boss-card-choice').forEach(c => c.style.borderColor = 'var(--border-color)');
      if (window.event && window.event.currentTarget) {
        window.event.currentTarget.style.borderColor = '#2563EB';
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
            <span class="pool-card-code">${card.code}</span>
            <div class="pool-card-name">${card.title}</div>
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
        banner.innerHTML = `<strong>ĐÃ CHỌN THẺ [${card.code}: ${card.title}]</strong>. Mời bạn bấm vào 1 trong 4 ô Mắt xích bên trên để ghép vào!`;
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
            <strong style="color: #15803D; font-size: 11px; display: block;">✓ ${card.code}: ${card.title}</strong>
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
          banner.innerHTML = `<strong>GHÉP CHUẨN XÁC! ✓</strong> Thẻ [${card.code}: ${card.title}] đã khớp hoàn hảo vào ${slotEl.querySelector('.slot-role-title').textContent}!`;
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
    }
  };
})();

// Khởi chạy hệ thống bài thuyết trình khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  Deck.init();
});
