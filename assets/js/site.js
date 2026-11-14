"use strict";

const disclosureSelector = "[data-disclosure]";
const disclosureButtonSelector = "[data-disclosure-button]";

const labelForState = (button, expanded) =>
    (expanded ? button.dataset.expandedLabel : button.dataset.collapsedLabel)
    || button.textContent.trim();

const setDisclosure = (section, expanded) => {
    const button = section.querySelector(disclosureButtonSelector);
    const summary = section.querySelector("[data-disclosure-summary]");
    const panel = section.querySelector("[data-disclosure-panel]");

    if (!button || !panel) {
        return;
    }

    if (summary) {
        summary.hidden = expanded;
    }
    panel.hidden = !expanded;
    section.dataset.expanded = String(expanded);
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = labelForState(button, expanded);
};

const disclosures = () => Array.from(document.querySelectorAll(disclosureSelector));

const syncToggleAll = () => {
    const button = document.querySelector("[data-toggle-all]");
    if (!button) {
        return;
    }

    const sections = disclosures();
    const expanded = sections.length > 0 && sections.every(
        (section) => section.dataset.expanded === "true",
    );
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = labelForState(button, expanded);
};

const initDisclosures = () => {
    for (const section of disclosures()) {
        const button = section.querySelector(disclosureButtonSelector);
        const panel = section.querySelector("[data-disclosure-panel]");
        if (!button || !panel) {
            continue;
        }
        setDisclosure(section, section.dataset.expanded === "true");
        button.hidden = false;
        button.addEventListener("click", () => {
            setDisclosure(section, section.dataset.expanded !== "true");
            syncToggleAll();
        });
    }

    const toggleAll = document.querySelector("[data-toggle-all]");
    if (!toggleAll) {
        return;
    }
    toggleAll.hidden = false;
    toggleAll.addEventListener("click", () => {
        const expand = toggleAll.getAttribute("aria-expanded") !== "true";
        for (const section of disclosures()) {
            setDisclosure(section, expand);
        }
        syncToggleAll();
    });
    syncToggleAll();
};

const setLanguage = (switcher, language, updateUrl) => {
    const isEnglish = language === "en";
    const button = switcher.querySelector("[data-language-button]");
    const chineseTitle = switcher.querySelector("#home-title-zh");
    const englishTitle = switcher.querySelector("#home-title-en");
    const chinesePanel = switcher.querySelector('[data-language-panel="zh"]');
    const englishPanel = switcher.querySelector('[data-language-panel="en"]');

    if (!button || !chineseTitle || !englishTitle || !chinesePanel || !englishPanel) {
        return false;
    }

    chineseTitle.hidden = isEnglish;
    chinesePanel.hidden = isEnglish;
    englishTitle.hidden = !isEnglish;
    englishPanel.hidden = !isEnglish;
    document.documentElement.lang = isEnglish ? "en" : "zh-Hans";
    switcher.setAttribute("aria-labelledby", isEnglish ? "home-title-en" : "home-title-zh");
    button.textContent = isEnglish ? button.dataset.enLabel : button.dataset.zhLabel;
    button.lang = isEnglish ? "zh-Hans" : "en";

    if (updateUrl) {
        const url = new URL(window.location.href);
        if (isEnglish) {
            url.searchParams.set("lang", "en");
        } else {
            url.searchParams.delete("lang");
        }
        window.history.replaceState(null, "", url);
    }
    return true;
};

const initLanguageSwitch = () => {
    const switcher = document.querySelector("[data-language-switch]");
    if (!switcher) {
        return;
    }

    const button = switcher.querySelector("[data-language-button]");
    if (!button) {
        return;
    }

    const initialLanguage = new URL(window.location.href).searchParams.get("lang") === "en"
        ? "en"
        : "zh";
    if (!setLanguage(switcher, initialLanguage, false)) {
        return;
    }
    button.hidden = false;
    button.addEventListener("click", () => {
        const nextLanguage = document.documentElement.lang === "en" ? "zh" : "en";
        setLanguage(switcher, nextLanguage, true);
    });
};

initLanguageSwitch();
initDisclosures();
