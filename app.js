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
      clues: [false, false, false, false]
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
      badge: "ĐIỂM TƯ LIỆU 01 // NĂM 1919 • KHÁT VỌNG ĐỘC LẬP",
      img: "assets/images/hotspot1_1919.jpg",
      caption: "Bản Yêu sách của nhân dân An Nam (1919) — Nguyễn Ái Quốc tại Hội nghị Versailles",
      quote: "“Cái mà tôi cần nhất trên đời này là đồng bào tôi được tự do, Tổ quốc tôi được độc lập.” — Hồ Chí Minh",
      question: "Theo tư tưởng Hồ Chí Minh, 'độc lập, tự do' có ý nghĩa như thế nào đối với mọi dân tộc?",
      options: [
        { key: "A", text: "Là mục tiêu tạm thời, có thể nhân nhượng nếu đổi lại một số lợi ích kinh tế." },
        { key: "B", text: "Là quyền thiêng liêng, bất khả xâm phạm của tất cả các dân tộc trên thế giới.", correct: true },
        { key: "C", text: "Là đặc quyền chỉ dành riêng cho các cường quốc đế quốc phương Tây." }
      ],
      storyTitle: "BÀI HỌC LỊCH SỬ: QUYỀN THIÊNG LIÊNG BẤT KHẢ XÂM PHẠM",
      storyText: "Từ Bản Yêu sách 8 điểm năm 1919 đến Tuyên ngôn Độc lập 1945 và Lời kêu gọi năm 1966 ('Không có gì quý hơn độc lập, tự do'), Hồ Chí Minh khẳng định độc lập dân tộc là quyền tự nhiên, thiêng liêng, vô giá và bất khả xâm phạm của mọi dân tộc.",
      clue: "MANH MỐI 01: Độc lập tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc."
    },
    2: {
      badge: "ĐIỂM TƯ LIỆU 02 // NĂM 1945 • HẠNH PHÚC DÂN SINH",
      img: "assets/images/hotspot2_1945.jpg",
      caption: "Diệt giặc đói, giặc dốt — Phong trào Bình dân học vụ sau Cách mạng Tháng Tám 1945",
      quote: "“Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì.” — Hồ Chí Minh (1945)",
      question: "Chủ tịch Hồ Chí Minh đặt ra yêu cầu cấp bách nào ngay sau khi đất nước giành được độc lập?",
      options: [
        { key: "A", text: "Chờ đợi kinh tế vĩ mô phát triển ổn định rồi mới quan tâm đến đời sống người nghèo." },
        { key: "B", text: "Làm cho dân có ăn, làm cho dân có mặc, làm cho dân có chỗ ở và được học hành.", correct: true },
        { key: "C", text: "Tập trung xây dựng bộ máy hành chính công quyền trước, tạm gác an sinh của dân." }
      ],
      storyTitle: "BÀI HỌC LỊCH SỬ: ĐỘC LẬP PHẢI GẮN VỚI HẠNH PHÚC CỦA NHÂN DÂN",
      storyText: "Chủ nghĩa xã hội và độc lập theo Bác không hề trừu tượng: Độc lập phải biến thành cơm ăn, áo mặc, nhà ở, học hành và quyền tự do hạnh phúc thiết thực cho nhân dân.",
      clue: "MANH MỐI 02: Độc lập phải gắn liền với cơm ăn, áo mặc, học hành và hạnh phúc nhân dân."
    },
    3: {
      badge: "ĐIỂM TƯ LIỆU 03 // BẢN CHẤT • ĐỘC LẬP TRIỆT ĐỂ",
      img: "assets/images/hotspot3_puppet.jpg",
      caption: "Vạch trần chiêu bài độc lập giả hiệu của thực dân và chính phủ bù nhìn thời thuộc địa",
      quote: "“Độc lập mà không có quyền tự quyết ngoại giao, quân đội riêng, tài chính riêng... thì độc lập đó chẳng có ý nghĩa gì.”",
      question: "Tiêu chí của một nền độc lập dân tộc thực sự theo tư tưởng Hồ Chí Minh là gì?",
      options: [
        { key: "A", text: "Chỉ cần chính phủ do người bản xứ đứng tên dù ngoại bang kiểm soát toàn bộ tài chính, quân sự." },
        { key: "B", text: "Phải hoàn toàn, triệt để trên mọi phương diện: tự quyết ngoại giao, quân đội riêng và tài chính riêng.", correct: true },
        { key: "C", text: "Chấp nhận sự bảo hộ quân sự và can thiệp nội bộ của các thế lực đế quốc bên ngoài." }
      ],
      storyTitle: "BÀI HỌC LỊCH SỬ: KIÊN QUYẾT BÁC BỎ 'ĐỘC LẬP GIẢ HIỆU'",
      storyText: "Bác chỉ rõ: Độc lập dân tộc phải là nền độc lập thực sự, hoàn toàn và triệt để. Tuyệt đối không chấp nhận các hình thức thỏa hiệp hay chiêu bài 'độc lập bánh vẽ' do ngoại bang giật dây.",
      clue: "MANH MỐI 03: Độc lập phải thực sự, hoàn toàn và triệt để, kiên quyết chống độc lập giả hiệu."
    },
    4: {
      badge: "ĐIỂM TƯ LIỆU 04 // TOÀN VẸN • THỐNG NHẤT NON SÔNG",
      img: "assets/images/hotspot4_unification.jpg",
      caption: "Khát vọng non sông liền một dải — Đôi bờ Hiền Lương & Thư gửi đồng bào Nam Bộ (1946)",
      quote: "“Đồng bào Nam Bộ là dân nước Việt Nam. Sông có thể cạn, núi có thể mòn, song chân lý đó không bao giờ thay đổi!”",
      question: "Tư tưởng xuyên suốt, bất biến của Hồ Chí Minh về lãnh thổ và sự thống nhất quốc gia là gì?",
      options: [
        { key: "A", text: "Chấp nhận chia cắt hai miền để phát triển hai thể chế kinh tế độc lập lâu dài." },
        { key: "B", text: "Nước Việt Nam là một, dân tộc Việt Nam là một; kiên quyết bảo vệ toàn vẹn lãnh thổ Tổ quốc.", correct: true },
        { key: "C", text: "Phụ thuộc vào sự phân định ranh giới từ các hiệp định của các nước lớn." }
      ],
      storyTitle: "BÀI HỌC LỊCH SỬ: THỐNG NHẤT TỔ QUỐC VÀ TOÀN VẸN LÃNH THỔ",
      storyText: "Độc lập dân tộc không thể tách rời sự toàn vẹn lãnh thổ. Bắc Nam sum họp một nhà, 'Nam Bộ là máu của máu Việt Nam, thịt của thịt Việt Nam'. Độc lập chỉ trọn vẹn khi non sông thu về một mối.",
      clue: "MANH MỐI 04: Độc lập dân tộc phải gắn liền với thống nhất Tổ quốc và toàn vẹn lãnh thổ."
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
      if (el) el.style.display = 'none';
    },

    // =============================================================
    // CHẶNG 1: KHÁM PHÁ BẢN ĐỒ TƯ LIỆU (3 MÀN HÌNH TUẦN TỰ)
    // =============================================================
    openHotspot(id) {
      AudioFX.click();
      const modal = document.getElementById('lv1-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      this.renderHotspotStep(id, 1);
    },

    renderHotspotStep(hpId, step) {
      const data = HOTSPOTS[hpId];
      const badgeEl = document.getElementById('m1-badge');
      if (badgeEl) badgeEl.textContent = data.badge;
      const content = document.getElementById('m1-content');
      if (!content) return;

      const stepPills = `
        <div class="modal-step-flow">
          <span class="modal-step-badge ${step === 1 ? 'active' : 'done'}">BƯỚC 1: QUAN SÁT TƯ LIỆU</span>
          <span class="modal-step-badge ${step === 2 ? 'active' : (step > 2 ? 'done' : '')}">BƯỚC 2: THỬ THÁCH NHẬN THỨC</span>
          <span class="modal-step-badge ${step === 3 ? 'active' : ''}">BƯỚC 3: ĐÚC KẾT BÀI HỌC</span>
        </div>
      `;

      // MÀN HÌNH 1: QUAN SÁT TƯ LIỆU LỊCH SỬ
      if (step === 1) {
        content.innerHTML = `
          ${stepPills}
          <div class="inspect-img-wrap">
            <img src="${data.img}" alt="${data.caption}" class="inspect-img">
          </div>
          <div style="font-style: italic; font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
            📸 <strong>Tư liệu lịch sử:</strong> ${data.caption}
          </div>
          <div class="k-content-quote" style="font-size: 15px; margin-bottom: 18px; background: #FAF9F6; padding: 12px 16px; border-radius: 8px; border-left: 4px solid var(--accent-pink);">
            ${data.quote}
          </div>
          <button class="btn btn-primary btn-full" onclick="Deck.renderHotspotStep(${hpId}, 2)">
            🔍 [ BẮT ĐẦU THỬ THÁCH NHẬN THỨC (BƯỚC 2) ➔ ]
          </button>
        `;
      }
      // MÀN HÌNH 2: THỬ THÁCH NHANH KIỂM TRA NHẬN THỨC
      else if (step === 2) {
        let optionsHtml = '';
        data.options.forEach(opt => {
          optionsHtml += `
            <button class="stage-opt-btn" onclick="Deck.answerHotspot(${hpId}, ${opt.correct || false}, this)">
              <span class="brutal-badge badge-black">${opt.key}</span>
              <span>${opt.text}</span>
            </button>
          `;
        });

        content.innerHTML = `
          ${stepPills}
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; background: #F9FAFB; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px;">
            <img src="${data.img}" alt="Thumb" style="width: 70px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #000;">
            <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">
              <strong>Câu hỏi nhận thức lịch sử:</strong><br>${data.caption}
            </div>
          </div>
          <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 14px; line-height: 1.4;">${data.question}</h4>
          <div class="stage-options-grid">${optionsHtml}</div>
          <div id="hp-fb" style="display: none; margin-top: 14px;"></div>
        `;
      }
      // MÀN HÌNH 3: ĐÚC KẾT BÀI HỌC & NHẬN THẺ MANH MỐI
      else if (step === 3) {
        content.innerHTML = `
          ${stepPills}
          <div class="story-card-box">
            <div class="story-card-title">📖 ${data.storyTitle}</div>
            <div class="story-card-text">${data.storyText}</div>
          </div>

          <div style="background: var(--accent-green); border: 2px solid #166534; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px; box-shadow: 3px 3px 0px #000;">
            <strong style="color: #14532D; font-size: 12px; display: block; font-family: var(--font-display); margin-bottom: 4px;">TRI THỨC MỞ KHÓA THÀNH CÔNG:</strong>
            <span style="font-size: 14px; font-weight: 700; color: #064E3B;">${data.clue}</span>
          </div>

          <button class="btn btn-primary btn-full btn-large" onclick="Deck.collectClue(${hpId})">
            🏆 [ LƯU VÀO SỔ TAY TƯ TƯỞNG & HOÀN THÀNH ➔ ]
          </button>
        `;
      }
    },

    answerHotspot(hpId, isCorrect, btnEl) {
      const fb = document.getElementById('hp-fb');
      if (!fb) return;

      if (isCorrect) {
        AudioFX.success();
        btnEl.classList.add('correct');
        fb.className = 'stage-feedback-box';
        fb.style.display = 'block';
        fb.innerHTML = `
          <strong>CHÍNH XÁC! ✓</strong> Nhận thức của bạn hoàn toàn chuẩn xác theo tư tưởng Hồ Chí Minh.<br>
          <button class="btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="Deck.renderHotspotStep(${hpId}, 3)">
            📖 TIẾP TỤC: XEM ĐÚC KẾT BÀI HỌC & MANH MỐI (BƯỚC 3) ➔
          </button>
        `;
      } else {
        AudioFX.error();
        btnEl.classList.add('wrong');
        fb.className = 'stage-feedback-box';
        fb.style.background = '#FEE2E2';
        fb.style.borderColor = '#DC2626';
        fb.style.display = 'block';
        fb.innerHTML = `<strong>CHƯA CHÍNH XÁC!</strong> Hãy suy ngẫm lại dựa trên nguyên lý độc lập, tự do đích thực của Chủ tịch Hồ Chí Minh.`;
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
          📸 <strong>Tư liệu lịch sử:</strong> ${data.caption}
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
          <strong>LUẬN CỨ HOÀN TOÀN CHUẨN XÁC! 🏆</strong><br>
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
          btn.innerHTML = 'CÔNG BỐ TOÀN VĂN HỆ THỐNG CHIẾN LƯỢC (5/5) ▶';
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
          actionBtn.innerHTML = '⏳ CẦN PHÂN BỔ VỪA ĐÚNG 100 ĐNL ĐỂ XÁC NHẬN';
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = '⚙️ [ XÁC NHẬN MÔ HÌNH XÃ HỘI (0/100 ĐNL) ▶ ]';
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
          actionBtn.innerHTML = `⏳ CẦN PHÂN BỔ VỪA ĐÚNG 100 ĐNL (ĐANG CÓ: ${total}/100)`;
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = `⚙️ [ XÁC NHẬN MÔ HÌNH XÃ HỘI (${total}/100 ĐNL) ▶ ]`;
        }
        return;
      }

      // 3. Đúng 100 ĐNL: Đánh giá Ma trận Đánh đổi
      if (eco >= 55) {
        title.textContent = 'XÃ HỘI TĂNG TRƯỞNG NÓNG — PHÂN HÓA GIAI CẤP';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'MÔ HÌNH THẤT BẠI ✕ (CẢNH BÁO ĐÁNH ĐỔI)';
        desc.innerHTML = '<strong>Hệ quả thực tiễn:</strong> Sản lượng vật chất tăng nhanh nhưng phát sinh bất công giàu nghèo gay gắt, đạo đức xã hội suy đồi, nhân dân mất quyền làm chủ thực chất.<br><em>Trái với tư tưởng Bác: Trong CNXH, kinh tế phải đi liền với công bằng và tiến bộ xã hội.</em>';
        this.setBars(35, 95, 25, 30);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ MÔ HÌNH MẤT CÂN ĐỐI — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '⚠️ [ XÃ HỘI TĂNG TRƯỞNG NÓNG (THẤT BẠI) ]';
      }
      else if (soc >= 55) {
        title.textContent = 'XÃ HỘI BÌNH QUÂN NGHÈO KHỔ — TRIỆT TIÊU ĐỘNG LỰC';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'MÔ HÌNH THẤT BẠI ✕ (CẢNH BÁO ĐÁNH ĐỔI)';
        desc.innerHTML = '<strong>Hệ quả thực tiễn:</strong> Cào bằng phúc lợi khi chưa có cơ sở vật chất kỹ thuật hiện đại sẽ dẫn tới chia đều sự nghèo nàn và triệt tiêu động lực lao động sáng tạo của nhân dân.<br><em>Trái với tư tưởng Bác: Muốn an sinh bền vững, trước hết phải phát triển lực lượng sản xuất hiện đại.</em>';
        this.setBars(50, 20, 40, 45);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ MÔ HÌNH MẤT CÂN ĐỐI — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '⚠️ [ XÃ HỘI BÌNH QUÂN NGHÈO KHỔ (THẤT BẠI) ]';
      }
      else if (pol >= 55) {
        title.textContent = 'XÃ HỘI QUAN LIÊU HÀNH CHÍNH GIÁO ĐIỀU';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'MÔ HÌNH THẤT BẠI ✕ (CẢNH BÁO ĐÁNH ĐỔI)';
        desc.innerHTML = '<strong>Hệ quả thực tiễn:</strong> Bộ máy hành chính cồng kềnh, mệnh lệnh quan liêu bao cấp triệt tiêu quyền làm chủ thực chất và năng lực sáng tạo của quần chúng nhân dân.<br><em>Trái với tư tưởng Bác: Chủ nghĩa xã hội là sự nghiệp sáng tạo của chính quần chúng nhân dân.</em>';
        this.setBars(45, 25, 35, 25);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ MÔ HÌNH MẤT CÂN ĐỐI — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '⚠️ [ XÃ HỘI QUAN LIÊU HÀNH CHÍNH (THẤT BẠI) ]';
      }
      else if (cul >= 55) {
        title.textContent = 'XÃ HỘI DUY TÂM — THIẾU NỀN TẢNG VẬT CHẤT';
        badge.className = 'sim-status-badge failed';
        badge.textContent = 'MÔ HÌNH THẤT BẠI ✕ (CẢNH BÁO ĐÁNH ĐỔI)';
        desc.innerHTML = '<strong>Hệ quả thực tiễn:</strong> Quá chú trọng tinh thần nhưng thiếu cơ sở vật chất kinh tế vững chắc để bảo đảm cơm no áo ấm thực tế cho đồng bào.';
        this.setBars(40, 20, 85, 35);
        if (actionBtn) {
          actionBtn.className = 'btn btn-danger btn-full';
          actionBtn.innerHTML = '✕ MÔ HÌNH MẤT CÂN ĐỐI — HÃY ĐIỀU CHỈNH LẠI';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '⚠️ [ XÃ HỘI DUY TÂM THIẾU VẬT CHẤT (THẤT BẠI) ]';
      }
      else if (eco >= 20 && eco <= 40 && pol >= 15 && pol <= 35 && cul >= 15 && cul <= 30 && soc >= 20 && soc <= 35) {
        title.textContent = 'MÔ HÌNH XÃ HỘI HÀI HÒA THEO CHUẨN MỰC HỒ CHÍ MINH';
        badge.className = 'sim-status-badge success';
        badge.textContent = 'THÀNH CÔNG RỰC RỠ ✓';
        desc.innerHTML = '<strong>Chuẩn mực Hồ Chí Minh:</strong> Phát triển đồng bộ 4 phương diện! Nhân dân làm chủ về chính trị, Lực lượng sản xuất hiện đại và chế độ công hữu, Văn hóa đạo đức mới soi đường quốc dân, và An sinh hạnh phúc ấm no cho toàn dân.';
        this.setBars(90, 85, 85, 95);
        if (actionBtn) {
          actionBtn.className = 'btn btn-primary btn-full';
          actionBtn.innerHTML = '🎉 XÁC NHẬN MÔ HÌNH ĐẠT CHUẨN ➔ TIẾN VÀO CHẶNG 4 ▶';
        }
        if (leftBuildBtn) {
          leftBuildBtn.innerHTML = '🎉 [ MÔ HÌNH ĐẠT CHUẨN HCM ➔ TIẾN BƯỚC ▶ ]';
        }
      }
      else {
        title.textContent = 'MÔ HÌNH CHƯA CÂN BẰNG TỐI ƯU';
        badge.className = 'sim-status-badge pending';
        badge.textContent = 'CẦN ĐIỀU CHỈNH ✕';
        desc.innerHTML = 'Tỷ lệ giữa 4 trụ cột chưa đạt được sự hài hòa tối ưu theo quan điểm Hồ Chí Minh. Gợi ý: Kinh tế đóng vai trò nền tảng vật chất (khoảng 25–35 ĐNL), kết hợp cân đối với Dân chủ chính trị (20–30 ĐNL), Văn hóa (15–25 ĐNL) và An sinh xã hội (20–30 ĐNL).';
        this.setBars(Math.min(pol + 20, 75), Math.min(eco + 20, 75), Math.min(cul + 20, 75), Math.min(soc + 20, 75));
        if (actionBtn) {
          actionBtn.className = 'btn btn-secondary btn-full';
          actionBtn.innerHTML = '⚠️ CHƯA HÀI HÒA — HÃY ĐIỀU CHỈNH LẠI TỶ LỆ';
        }
        if (leftBuildBtn) leftBuildBtn.innerHTML = '⚠️ [ CHƯA CÂN BẰNG — CẦN ĐIỀU CHỈNH ]';
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
          errBanner.innerHTML = `⚠️ Tổng điểm đang là <strong>${total}/100 ĐNL</strong>. Bạn cần phân bổ vừa đúng 100 ĐNL trước khi chốt! (${rem > 0 ? 'Còn thiếu ' + rem : 'Đang vượt quá ' + Math.abs(rem)} ĐNL)`;
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
          errBanner.innerHTML = `⚠️ Mô hình hiện tại chưa đạt chuẩn hài hòa Hồ Chí Minh! Hãy quan sát phân tích ở bảng bên phải và điều chỉnh lại.`;
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
            <div class="ch-caption">📸 ${data.caption}</div>
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
        banner.innerHTML = `👉 <strong>ĐÃ CHỌN THẺ [${card.code}: ${card.title}]</strong>. Mời bạn bấm vào 1 trong 4 ô Mắt xích bên trên để ghép vào!`;
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
          banner.innerHTML = `⚠️ <strong>HÃY CHỌN MẢNH GHÉP TRƯỚC!</strong> Bấm vào 1 thẻ ở ngân hàng bên dưới, sau đó bấm vào ô Mắt xích này để thử ghép!`;
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
          banner.innerHTML = `🎉 <strong>GHÉP CHUẨN XÁC!</strong> Thẻ [${card.code}: ${card.title}] đã khớp hoàn hảo vào ${slotEl.querySelector('.slot-role-title').textContent}!`;
        }

        // Kiểm tra xem đã đủ 4/4 ô chưa
        const allFilled = Object.values(State.chain.slots).every(Boolean);
        if (allFilled) {
          AudioFX.fanfare();
          document.querySelectorAll('.chain-slot-card').forEach(s => s.classList.add('all-connected-glow'));
          if (banner) {
            banner.innerHTML = `🏆 <strong>XUẤT SẮC! TOÀN BỘ 4 MẮT XÍCH BIỆN CHỨNG ĐÃ ĐƯỢC KẾT NỐI HOÀN HẢO!</strong>`;
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
          banner.innerHTML = `❌ <strong>CHƯA ĐÚNG LOGIC BIỆN CHỨNG!</strong> Thẻ "<strong>${card.title}</strong>" không thể đặt vào mắt xích này. Hãy suy ngẫm vai trò: Tiền đề xuất phát, Con đường, Mục tiêu hay Thực tiễn?`;
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
