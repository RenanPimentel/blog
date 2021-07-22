export const focus = (id: string, cb?: () => void) => {
  let interval: NodeJS.Timeout | null = null;

  interval = setInterval(() => {
    const element = document.getElementById(id);
    if (!element) return;
    element.focus();
    clearInterval(interval as NodeJS.Timeout);
    cb && cb();
  }, 0);
};
