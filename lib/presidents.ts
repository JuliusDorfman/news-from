export type Party = 'R' | 'D' | 'other'
export interface PresidentTerm { start: number; end: number } // calendar years
export interface President { id: string; name: string; party: Party; terms: PresidentTerm[] }

export const presidents: President[] = [
  // 1
  { id: 'washington', name: 'George Washington', party: 'other', terms: [{ start: 1789, end: 1793 }, { start: 1793, end: 1797 }] },
  // 2
  { id: 'john-adams', name: 'John Adams', party: 'other', terms: [{ start: 1797, end: 1801 }] },
  // 3
  { id: 'jefferson', name: 'Thomas Jefferson', party: 'other', terms: [{ start: 1801, end: 1805 }, { start: 1805, end: 1809 }] },
  // 4
  { id: 'madison', name: 'James Madison', party: 'other', terms: [{ start: 1809, end: 1813 }, { start: 1813, end: 1817 }] },
  // 5
  { id: 'monroe', name: 'James Monroe', party: 'other', terms: [{ start: 1817, end: 1821 }, { start: 1821, end: 1825 }] },
  // 6
  { id: 'jqadams', name: 'John Quincy Adams', party: 'other', terms: [{ start: 1825, end: 1829 }] },
  // 7
  { id: 'jackson', name: 'Andrew Jackson', party: 'D', terms: [{ start: 1829, end: 1833 }, { start: 1833, end: 1837 }] },
  // 8
  { id: 'van-buren', name: 'Martin Van Buren', party: 'D', terms: [{ start: 1837, end: 1841 }] },
  // 9 - died after 32 days
  { id: 'wh-harrison', name: 'William Henry Harrison', party: 'other', terms: [{ start: 1841, end: 1841 }] },
  // 10 - succeeded Harrison
  { id: 'tyler', name: 'John Tyler', party: 'other', terms: [{ start: 1841, end: 1845 }] },
  // 11
  { id: 'polk', name: 'James K. Polk', party: 'D', terms: [{ start: 1845, end: 1849 }] },
  // 12 - died in office
  { id: 'taylor', name: 'Zachary Taylor', party: 'other', terms: [{ start: 1849, end: 1850 }] },
  // 13 - succeeded Taylor
  { id: 'fillmore', name: 'Millard Fillmore', party: 'other', terms: [{ start: 1850, end: 1853 }] },
  // 14
  { id: 'pierce', name: 'Franklin Pierce', party: 'D', terms: [{ start: 1853, end: 1857 }] },
  // 15
  { id: 'buchanan', name: 'James Buchanan', party: 'D', terms: [{ start: 1857, end: 1861 }] },
  // 16 - assassinated early in 2nd term
  { id: 'lincoln', name: 'Abraham Lincoln', party: 'R', terms: [{ start: 1861, end: 1865 }, { start: 1865, end: 1865 }] },
  // 17 - succeeded Lincoln
  { id: 'andrew-johnson', name: 'Andrew Johnson', party: 'D', terms: [{ start: 1865, end: 1869 }] },
  // 18
  { id: 'grant', name: 'Ulysses S. Grant', party: 'R', terms: [{ start: 1869, end: 1873 }, { start: 1873, end: 1877 }] },
  // 19
  { id: 'hayes', name: 'Rutherford B. Hayes', party: 'R', terms: [{ start: 1877, end: 1881 }] },
  // 20 - died in office
  { id: 'garfield', name: 'James A. Garfield', party: 'R', terms: [{ start: 1881, end: 1881 }] },
  // 21 - succeeded Garfield
  { id: 'arthur', name: 'Chester A. Arthur', party: 'R', terms: [{ start: 1881, end: 1885 }] },
  // 22 & 24 - two non-consecutive terms
  { id: 'cleveland', name: 'Grover Cleveland', party: 'D', terms: [{ start: 1885, end: 1889 }, { start: 1893, end: 1897 }] },
  // 23
  { id: 'benjamin-harrison', name: 'Benjamin Harrison', party: 'R', terms: [{ start: 1889, end: 1893 }] },
  // 25 - assassinated early in 2nd term
  { id: 'mckinley', name: 'William McKinley', party: 'R', terms: [{ start: 1897, end: 1901 }, { start: 1901, end: 1901 }] },
  // 26 - succeeded McKinley, then elected for own term
  { id: 'theodore-roosevelt', name: 'Theodore Roosevelt', party: 'R', terms: [{ start: 1901, end: 1905 }, { start: 1905, end: 1909 }] },
  // 27
  { id: 'taft', name: 'William Howard Taft', party: 'R', terms: [{ start: 1909, end: 1913 }] },
  // 28
  { id: 'wilson', name: 'Woodrow Wilson', party: 'D', terms: [{ start: 1913, end: 1917 }, { start: 1917, end: 1921 }] },
  // 29 - died in office
  { id: 'harding', name: 'Warren G. Harding', party: 'R', terms: [{ start: 1921, end: 1923 }] },
  // 30 - succeeded Harding, then elected for own term
  { id: 'coolidge', name: 'Calvin Coolidge', party: 'R', terms: [{ start: 1923, end: 1925 }, { start: 1925, end: 1929 }] },
  // 31
  { id: 'hoover', name: 'Herbert Hoover', party: 'R', terms: [{ start: 1929, end: 1933 }] },
  // 32 - four terms
  { id: 'fdr', name: 'Franklin D. Roosevelt', party: 'D', terms: [{ start: 1933, end: 1937 }, { start: 1937, end: 1941 }, { start: 1941, end: 1945 }, { start: 1945, end: 1945 }] },
  // 33 - succeeded FDR, then elected for own term
  { id: 'truman', name: 'Harry S. Truman', party: 'D', terms: [{ start: 1945, end: 1949 }, { start: 1949, end: 1953 }] },
  // 34
  { id: 'eisenhower', name: 'Dwight D. Eisenhower', party: 'R', terms: [{ start: 1953, end: 1957 }, { start: 1957, end: 1961 }] },
  // 35 - assassinated in office
  { id: 'kennedy', name: 'John F. Kennedy', party: 'D', terms: [{ start: 1961, end: 1963 }] },
  // 36 - succeeded Kennedy, then elected for own term
  { id: 'lbj', name: 'Lyndon B. Johnson', party: 'D', terms: [{ start: 1963, end: 1965 }, { start: 1965, end: 1969 }] },
  // 37 - resigned during 2nd term
  { id: 'nixon', name: 'Richard Nixon', party: 'R', terms: [{ start: 1969, end: 1973 }, { start: 1973, end: 1974 }] },
  // 38 - succeeded Nixon, never elected
  { id: 'ford', name: 'Gerald Ford', party: 'R', terms: [{ start: 1974, end: 1977 }] },
  // 39
  { id: 'carter', name: 'Jimmy Carter', party: 'D', terms: [{ start: 1977, end: 1981 }] },
  // 40
  { id: 'reagan', name: 'Ronald Reagan', party: 'R', terms: [{ start: 1981, end: 1985 }, { start: 1985, end: 1989 }] },
  // 41
  { id: 'ghw-bush', name: 'George H.W. Bush', party: 'R', terms: [{ start: 1989, end: 1993 }] },
  // 42
  { id: 'clinton', name: 'Bill Clinton', party: 'D', terms: [{ start: 1993, end: 1997 }, { start: 1997, end: 2001 }] },
  // 43
  { id: 'gw-bush', name: 'George W. Bush', party: 'R', terms: [{ start: 2001, end: 2005 }, { start: 2005, end: 2009 }] },
  // 44
  { id: 'obama', name: 'Barack Obama', party: 'D', terms: [{ start: 2009, end: 2013 }, { start: 2013, end: 2017 }] },
  // 46
  { id: 'biden', name: 'Joe Biden', party: 'D', terms: [{ start: 2021, end: 2025 }] },
  // 45 & 47 - two non-consecutive terms; CURRENT administration (LAST)
  { id: 'trump', name: 'Donald Trump', party: 'R', terms: [{ start: 2017, end: 2021 }, { start: 2025, end: 2029 }] },
]

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th']

export interface TermOption { key: string; label: string; years: string; start: number; end: number }

export function getPresident(id: string): President | undefined {
  return presidents.find(p => p.id === id)
}

export function termOptions(presidentId: string): TermOption[] {
  const p = getPresident(presidentId)
  if (!p) return []
  const opts: TermOption[] = p.terms.map((t, i) => ({
    key: String(i + 1),
    label: `${ORDINALS[i] ?? `${i + 1}th`} term`,
    years: `${t.start}–${t.end}`,
    start: t.start,
    end: t.end,
  }))
  if (p.terms.length > 1) {
    const start = p.terms[0].start
    const end = p.terms[p.terms.length - 1].end
    opts.push({ key: 'full', label: 'Full term', years: `${start}–${end}`, start, end })
  }
  return opts
}

export function defaultTermKey(presidentId: string): string {
  const opts = termOptions(presidentId)
  return opts.find(o => o.key === 'full')?.key ?? opts[0]?.key ?? '1'
}
