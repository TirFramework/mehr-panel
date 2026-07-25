const fontFamily =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const sharedTheme = {
  token: {
    colorPrimary: "#6366f1",
    colorInfo: "#6366f1",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily,
    controlHeight: 38,
    wireframe: false,
    motionDurationMid: "0.2s",
  },
  components: {
    Button: {
      primaryShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
      fontWeight: 500,
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBorderRadius: 10,
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
    },
    Input: {
      activeShadow: "0 0 0 2px rgba(99, 102, 241, 0.12)",
    },
    Layout: {
      headerHeight: 64,
      siderBg: "#1e1b4b",
    },
  },
};

export default sharedTheme;
