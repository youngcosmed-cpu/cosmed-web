export const content = {
  en: {
    nav: {
      products: 'Products',
      about: 'About',
      contact: 'Contact',
    },
    why: {
      title: 'Why Young Cosmed',
      cards: [
        {
          title: 'Global-Ready Products',
          desc: 'Export-ready formulations and packaging compliant with international regulations.',
        },
        {
          title: 'Clear MOQ & Pricing',
          desc: 'Transparent wholesale conditions with no hidden costs or complicated tiers.',
        },
        {
          title: 'Direct Communication',
          desc: 'No middleman. Direct response from our sourcing team within 24 hours.',
        },
        {
          title: 'Curated Selection',
          desc: 'Only verified Korean medical aesthetic products from trusted manufacturers.',
        },
      ],
    },
    products: {
      title: 'Products',
      allCategory: 'All',
      inquiryBtn: 'Request Bulk Pricing',
      emptyState: 'No products available yet. Please check back soon.',
    },
    cta: {
      title: 'Start your wholesale sourcing with confidence.',
      desc: 'Get in touch with our team for pricing, samples, and partnership opportunities.',
      btn: 'Contact for Wholesale',
    },
    footer: {
      companyName: 'Young Cosmed',
      tagline: 'Medical Aesthetic Products — B2B Wholesale',
      ceo: 'CEO',
      ceoName: 'Eun Young Kwak',
      bizNo: 'Business Reg. No.',
      bizNoValue: '763-58-00698',
      address: 'Address',
      addressValue: '69, Seongsui-ro, Seongdong-gu, Seoul, Republic of Korea',
      email: 'Email',
      emailValue: 'wholesale@youngcosmed.com',
      copyright: '© 2025 Young Cosmed. All rights reserved.',
    },
  },
  ko: {
    nav: {
      products: '제품',
      about: '소개',
      contact: '문의',
    },
    why: {
      title: 'Why Young Cosmed',
      cards: [
        {
          title: '글로벌 규격 충족',
          desc: '국제 규정을 준수하는 수출용 포뮬러와 패키징을 제공합니다.',
        },
        {
          title: '투명한 MOQ와 가격',
          desc: '숨겨진 비용이나 복잡한 단계 없이 명확한 도매 조건을 안내합니다.',
        },
        {
          title: '다이렉트 소통',
          desc: '중간 유통 없이 소싱팀이 24시간 내 직접 응대합니다.',
        },
        {
          title: '검증된 셀렉션',
          desc: '신뢰할 수 있는 제조사의 검증된 의료 미용 제품만 취급합니다.',
        },
      ],
    },
    products: {
      title: 'Products',
      allCategory: '전체',
      inquiryBtn: '대량 견적 요청',
      emptyState: '아직 등록된 제품이 없습니다. 곧 업데이트될 예정입니다.',
    },
    cta: {
      title: '신뢰할 수 있는 도매 소싱을 시작하세요.',
      desc: '가격, 샘플, 파트너십 기회에 대해 팀에 문의하세요.',
      btn: '도매 문의하기',
    },
    footer: {
      companyName: 'Young Cosmed',
      tagline: '의료 미용 제품 — B2B 도매',
      ceo: '대표',
      ceoName: '곽은영',
      bizNo: '사업자등록번호',
      bizNoValue: '763-58-00698',
      address: '주소',
      addressValue: '서울특별시 성동구 성수이로 69',
      email: '이메일',
      emailValue: 'wholesale@youngcosmed.com',
      copyright: '© 2025 Young Cosmed. All rights reserved.',
    },
  },
} as const;

export type Lang = 'en' | 'ko';
export type Content = typeof content;
