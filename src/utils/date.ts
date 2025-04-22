export const toISO = (d: string) => {
    const [dd, mm, yyyy] = d.split(".");
    return `${yyyy}-${mm}-${dd}`;
  };
  export const fromISO = (iso: string) => {
    const [yyyy, mm, dd] = iso.split("-");
    return `${dd}.${mm}.${yyyy}`;
  };
  