import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Checkbox, Input, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { useDebouncedValue } from "../hooks/useDebouncedValue";

const LARGE_DATASET_THRESHOLD = 100;
const INITIAL_SCAN_COUNT = 20;
const SCAN_BATCH_COUNT = 40;
const LIST_HEIGHT = 200;
const LIST_MIN_WIDTH = 200;
const LIST_MAX_WIDTH = 420;
const LIST_DEFAULT_WIDTH = 320;
const ITEM_HEIGHT = 32;
const OVERSCAN = 4;
const SEARCH_DEBOUNCE_MS = 200;

function FilterLoading() {
  return (
    <LoadingOutlined
      className="filter-checkbox-list__loading-icon"
      spin
    />
  );
}

function buildOptionIndex(data) {
  const source = data ?? [];
  const indexedOptions = new Array(source.length);

  for (let i = 0; i < source.length; i++) {
    const item = source[i];
    const label = String(item.label ?? item.text ?? "");
    indexedOptions[i] = {
      value: item.value,
      label,
      searchText: label.toLowerCase(),
    };
  }

  return { indexedOptions, totalCount: source.length };
}

function scanSearchMatches(indexedOptions, query, fromIndex, targetCount) {
  const matches = [];
  let i = fromIndex;

  while (i < indexedOptions.length && matches.length < targetCount) {
    const opt = indexedOptions[i++];
    if (opt.searchText.includes(query)) {
      matches.push(opt);
    }
  }

  return { matches, nextIndex: i };
}

function estimateListWidth(indexedOptions) {
  if (!indexedOptions.length) return LIST_DEFAULT_WIDTH;

  let longest = "";
  for (let i = 0; i < indexedOptions.length; i++) {
    const label = indexedOptions[i].label;
    if (label.length > longest.length) longest = label;
  }

  const estimated = Math.ceil(longest.length * 8) + 48;
  return Math.min(
    LIST_MAX_WIDTH,
    Math.max(LIST_MIN_WIDTH, estimated)
  );
}

function getVirtualWindow(totalScrollItems, loadedCount, scrollTop) {
  const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const visibleRows = Math.ceil(LIST_HEIGHT / ITEM_HEIGHT) + OVERSCAN * 2;
  const end = Math.min(loadedCount, start + visibleRows);

  return {
    start,
    end,
    offsetY: start * ITEM_HEIGHT,
    totalHeight: totalScrollItems * ITEM_HEIGHT,
  };
}

const FilterCheckboxRow = React.memo(
  function FilterCheckboxRow({ label, value, checked, onToggle }) {
    return (
      <div
        className={
          checked
            ? "filter-checkbox-list__item filter-checkbox-list__item--selected"
            : "filter-checkbox-list__item"
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onToggle(value, e.target.checked);
          }}
        >
          <span className="filter-checkbox-list__label" title={label}>
            {label}
          </span>
        </Checkbox>
      </div>
    );
  },
  (prev, next) =>
    prev.value === next.value &&
    prev.label === next.label &&
    prev.checked === next.checked &&
    prev.onToggle === next.onToggle
);

const FilterScrollList = React.memo(function FilterScrollList({
  items,
  totalScrollItems,
  selectedSet,
  onToggle,
  emptyText,
  isLoadingMore,
  onScroll,
  scrollRef,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const rafRef = useRef(null);
  const contentHeight = totalScrollItems * ITEM_HEIGHT;
  const useVirtual = contentHeight > LIST_HEIGHT;

  const windowRange = useMemo(() => {
    if (!useVirtual) {
      return {
        start: 0,
        end: items.length,
        offsetY: 0,
        totalHeight: totalScrollItems * ITEM_HEIGHT,
      };
    }
    return getVirtualWindow(totalScrollItems, items.length, scrollTop);
  }, [totalScrollItems, items.length, scrollTop, useVirtual]);

  const visibleItems = useMemo(
    () => items.slice(windowRange.start, windowRange.end),
    [items, windowRange.start, windowRange.end]
  );

  const handleScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    if (useVirtual) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrollTop(top));
    }
    onScroll?.(e, top);
  };

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  if (totalScrollItems === 0) {
    return (
      <div
        ref={scrollRef}
        className="filter-checkbox-list__scroll mp-scrollbar"
        style={{ height: LIST_HEIGHT }}
      >
        <div className="filter-checkbox-list__empty">{emptyText}</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="filter-checkbox-list__scroll mp-scrollbar"
      style={{ height: LIST_HEIGHT }}
      onScroll={handleScroll}
    >
      <div
        className="filter-checkbox-list__inner"
        style={{ height: windowRange.totalHeight }}
      >
        <div style={{ paddingTop: windowRange.offsetY }}>
          {visibleItems.map((item) => (
            <FilterCheckboxRow
              key={String(item.value)}
              label={item.label}
              value={item.value}
              checked={selectedSet.has(String(item.value))}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>

      {isLoadingMore && (
        <div className="filter-checkbox-list__loading-overlay">
          <FilterLoading />
        </div>
      )}
    </div>
  );
});

function FilterStatus({ mode, totalCount, matchCount, hasMore, isLoadingMore }) {
  const formattedTotal = totalCount.toLocaleString();

  if (mode === "empty") {
    return (
      <Typography.Text type="secondary" className="filter-checkbox-list__status">
        No results
      </Typography.Text>
    );
  }

  if (mode === "browse") {
    return (
      <Typography.Text type="secondary" className="filter-checkbox-list__status">
        {formattedTotal} items
        {isLoadingMore ? " …" : ""}
      </Typography.Text>
    );
  }

  if (mode === "search") {
    return (
      <Typography.Text type="secondary" className="filter-checkbox-list__status">
        {matchCount > 0
          ? `${matchCount.toLocaleString()} result${matchCount === 1 ? "" : "s"}`
          : isLoadingMore
            ? "Searching…"
            : `${formattedTotal} items`}
        {hasMore && matchCount > 0 ? " — scroll for more" : ""}
        {isLoadingMore && matchCount > 0 ? " …" : ""}
      </Typography.Text>
    );
  }

  return null;
}

function FilterCheckboxList({ data, selectedKeys, setSelectedKeys }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const [scanTarget, setScanTarget] = useState(INITIAL_SCAN_COUNT);
  const [searchPool, setSearchPool] = useState([]);
  const [scanDone, setScanDone] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollRef = useRef(null);
  const scanIndexRef = useRef(0);
  const searchPoolRef = useRef([]);
  const scanTargetRef = useRef(INITIAL_SCAN_COUNT);
  const selectedKeysRef = useRef(selectedKeys);
  selectedKeysRef.current = selectedKeys;

  const { indexedOptions, totalCount } = useMemo(
    () => buildOptionIndex(data),
    [data]
  );

  const selectedSet = useMemo(() => {
    const keys = Array.isArray(selectedKeys) ? selectedKeys : [];
    return new Set(keys.map((k) => String(k)));
  }, [selectedKeys]);

  const query = debouncedSearch.trim().toLowerCase();
  const isSearching = search.trim() !== debouncedSearch.trim();
  const isLarge = totalCount > LARGE_DATASET_THRESHOLD;
  const isSearchMode = query.length > 0;

  useEffect(() => {
    setScanTarget(INITIAL_SCAN_COUNT);
    scanTargetRef.current = INITIAL_SCAN_COUNT;
    setSearchPool([]);
    setScanDone(false);
    scanIndexRef.current = 0;
    searchPoolRef.current = [];
    setIsLoadingMore(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [query, indexedOptions]);

  useEffect(() => {
    if (!isSearchMode) return;

    const needed = scanTargetRef.current;
    let pool = searchPoolRef.current;
    let index = scanIndexRef.current;

    if (pool.length >= needed || index >= indexedOptions.length) {
      setIsLoadingMore(false);
      return;
    }

    setIsLoadingMore(true);

    while (pool.length < needed && index < indexedOptions.length) {
      const { matches, nextIndex } = scanSearchMatches(
        indexedOptions,
        query,
        index,
        needed - pool.length
      );
      pool = pool.concat(matches);
      index = nextIndex;
    }

    searchPoolRef.current = pool;
    scanIndexRef.current = index;
    const done = index >= indexedOptions.length;
    setScanDone(done);
    setSearchPool(pool);
    setIsLoadingMore(false);
  }, [isSearchMode, query, scanTarget, indexedOptions]);

  const listItems = isSearchMode ? searchPool : indexedOptions;

  const totalScrollItems = useMemo(() => {
    if (isSearchMode) {
      return scanDone ? searchPool.length : totalCount;
    }
    return totalCount;
  }, [isSearchMode, scanDone, searchPool.length, totalCount]);

  const searchHasMore = isSearchMode && !scanDone;

  const onScroll = useCallback(
    (_e, scrollTop) => {
      if (!isSearchMode || scanDone) return;

      const visibleRows = Math.ceil(LIST_HEIGHT / ITEM_HEIGHT) + OVERSCAN;
      const targetIndex =
        Math.floor(scrollTop / ITEM_HEIGHT) + visibleRows + SCAN_BATCH_COUNT;

      if (targetIndex > searchPoolRef.current.length) {
        const nextTarget = Math.min(targetIndex, totalCount);
        if (nextTarget > scanTargetRef.current) {
          scanTargetRef.current = nextTarget;
          setScanTarget(nextTarget);
        }
      }
    },
    [isSearchMode, scanDone, totalCount]
  );

  const onToggle = useCallback(
    (value, checked) => {
      const key = String(value);
      const keys = Array.isArray(selectedKeysRef.current)
        ? [...selectedKeysRef.current]
        : [];

      if (checked) {
        if (keys.some((k) => String(k) === key)) return;
        setSelectedKeys([...keys, value]);
        return;
      }

      setSelectedKeys(keys.filter((k) => String(k) !== key));
    },
    [setSelectedKeys]
  );

  const statusMode = useMemo(() => {
    if (isSearchMode && searchPool.length === 0 && scanDone) return "empty";
    if (isSearchMode) return "search";
    if (isLarge) return "browse";
    return null;
  }, [isSearchMode, isLarge, searchPool.length, scanDone]);

  const listWidth = useMemo(
    () => estimateListWidth(indexedOptions),
    [indexedOptions]
  );

  const showSearch = totalCount > 10 || search.length > 0;
  const emptyText = statusMode === "empty" ? "No results" : "No items";

  return (
    <div
      className="filter-checkbox-list"
      style={{ width: listWidth }}
    >
      {showSearch && (
        <Input
          size="small"
          className="filter-checkbox-list__search"
          placeholder={
            isLarge
              ? `Search ${totalCount.toLocaleString()} items…`
              : "Search in filters"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          suffix={isSearching ? <FilterLoading /> : null}
        />
      )}

      {statusMode && (
        <FilterStatus
          mode={statusMode}
          totalCount={totalCount}
          matchCount={searchPool.length}
          hasMore={searchHasMore}
          isLoadingMore={isLoadingMore}
        />
      )}

      <FilterScrollList
        items={listItems}
        totalScrollItems={totalScrollItems}
        selectedSet={selectedSet}
        onToggle={onToggle}
        emptyText={emptyText}
        isLoadingMore={isLoadingMore && isSearchMode}
        onScroll={onScroll}
        scrollRef={scrollRef}
      />
    </div>
  );
}

export default FilterCheckboxList;
