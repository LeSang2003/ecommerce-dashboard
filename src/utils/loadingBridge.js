let _show, _hide;

export const bindLoading = (show, hide) => {
  _show = show;
  _hide = hide;
};

export const showLoading = () => _show && _show();
export const hideLoading = () => _hide && _hide();
