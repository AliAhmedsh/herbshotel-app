export type AffiliateMeta = {
  ttvalue?: string;
  bonus_title?: string;
  free_spins?: string;
  ausi_background_color?: string;
  detcasino_section01_2_detcasino_value_section1?: number;
  info_title1?: string;
  affiliate_rating?: string;
  url?: string;
  aff_link?: string;
  payment_logos?: Record<string, string>;
  copyright_txt?: string;
  copyright_txt_html?: string;
};

export type Affiliate = {
  id: number;
  title: string;
  thumbnail: string;
  meta: AffiliateMeta;
};

export type PageMeta = Record<string, string | number | boolean | null>;

export type ToplistResponse = {
  page_meta: PageMeta;
  affiliates: Affiliate[];
};
