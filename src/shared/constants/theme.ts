import type { ThemeConfig } from "antd";

export const COLORS = {
    color01:'#F0F1E6', //white
    color02:'#8D8C5F', //light-haki
    color03:'#62623C', //medium-haki
    color04:'#3E4826', //dark-haki
    color05:'#0E120A', //dark
    color06:'#E5AC30', //gold
    color07:'#5972B7', //marine
    color08:'#BD1645', //crimson
    color09:'F4F4F4', //white 09
    color_gradient:'#3E4826', //medium
    color010:'#E5E5D8', //light-green
    color_grey:'#DADADA', //grey
    color_green:'539E1A' //green
}


export const FONTS = {
  family: {
    montserrat: `'Montserrat', Arial, sans-serif`,
    montserratSemibold: `'Montserrat Semibold', Montserrat, Arial, sans-serif`,
    montserratRegular: `'Montserrat Regular', Montserrat, Arial, sans-serif`,
    montserratBold: `'Montserrat Bold', Montserrat, Arial, sans-serif`,
  },
    weight: {
        semibold: 600,
        bold: 700,
        regular: 400,
  },
    size: {
        h1: '36px',
        h2: '32px',
        h3: '30px',
        h4: '28px',
        h5: '24px',
        h6: '18px',
        h6small: '16px',
        h6xs: '15px',
    }

}

export const myCustomTheme: ThemeConfig = {
  token: {
     colorError: '#BD1645',
  colorErrorBorder: '#98D8D',
    colorPrimary: '#3E472C', 
    colorLink: '#539E1A', 
    colorSuccess: '#539E1A',
    colorTextBase: '#2C2C2C',
    colorBgContainer: '#F5F5F5',
      fontFamily: 'Montserrat, Arial, sans-serif',
    borderRadius: 5,
    blueTagGradient: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%), #5972B7',
    greenTagGradient: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(40, 38, 38, 0.6) 100%), #539E1A',
    redTagGradient:`linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(40, 38, 38, 0.6) 100%), ${COLORS.color08}`,
    tagTextColor: '#FFFFFF',
    tagFontSize: 15,
    tagPaddingVertical: 5,
    tagPaddingHorizontal: 15,
    tagBoxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  components: {
    Tabs: {
      itemSelectedColor: '#fff',
      itemActiveColor: '#fff',
      itemColor: '#3E472C',
      itemHoverColor: '#454E30',
      inkBarColor: '#454E30',
      cardBg: '#000', 
      horizontalItemPadding: '12px 32px',
      horizontalItemMargin: '0 10px 0 0',
    },
    Card: {
      colorBgContainer: '#EAEAEA',
      boxShadow: 'none',
      borderRadius: 15,
    },
    Typography: {
      titleMarginBottom: 0,
    },
    Rate: {
      starColor: '#FFD700',
      starSize: 20,
    },
    Tag: {
      fontSize: 16,
      borderRadius: 8,
      colorText: '#FFFFFF',
      colorBorder: 'transparent', 
  
    },
  },
  };