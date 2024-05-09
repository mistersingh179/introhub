"use client";

import React from "react";
import {
  ActionMeta,
  CSSObjectWithLabel,
  GroupBase,
  InputActionMeta,
  MultiValue,
  MultiValueGenericProps,
} from "react-select";
import AsyncSelect from "react-select/async";
import commandScore from "command-score";
import { CSSObject } from "@emotion/serialize";

type MyOption = { value: string; label: string };

type MyDropDownProps = {
  options: MyOption[];
  placeholder: string;
  selected: MyOption[];
  setSelected: React.Dispatch<React.SetStateAction<MyOption[]>>;
};

const MyDropDown = (props: MyDropDownProps): React.ReactElement => {
  const { options, placeholder, selected, setSelected } = props;

  const filterOptions = (query: string) => {
    const results: { score: number; option: MyOption }[] = [];

    options.forEach((option) => {
      const score = commandScore(option.value, query);
      if (score > 0) {
        results.push({ score: score, option: option });
      }
    });

    return results
      .sort(function (a, b) {
        if (a.score === b.score) {
          return a.option.value.localeCompare(b.option.value);
        }
        return b.score - a.score;
      })
      .map(function (suggestion) {
        return suggestion.option;
      });
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: MyOption[]) => void,
  ) => {
    callback(filterOptions(inputValue).slice(0, 5));
  };
  const changeHandler = (
    newValue: MultiValue<MyOption>,
    actionMeta: ActionMeta<MyOption>,
  ) => {
    console.log("changeHandler ", newValue, actionMeta);
    setSelected([...newValue]);
  };
  const inputChangeHandler = (
    newValue: string,
    actionMeta: InputActionMeta,
  ) => {
    console.log("inputChangeHandler ", newValue, actionMeta);
  };

  const customStyles = {
    control: (provided: CSSObject, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      borderColor: state.isFocused
        ? "hsl(var(--foreground))"
        : "hsl(var(--input))", // Darker border
      boxShadow: "none",
      "&:hover": {
        borderColor: "hsl(var(--foreground))",
        boxShadow: "none",
      },
    }),
    clearIndicator: (provided: CSSObjectWithLabel) => ({
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        // backgroundColor: `hsl(var(--input))`,
        color: `hsl(var(--foreground))`,
      },
      paddingRight: "4px",
    }),
    menu: (provided: CSSObject) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
    }),
    option: (
      provided: CSSObject,
      state: { isSelected: boolean; isFocused: boolean },
    ) => {
      console.log("option: ", state);
      return {
        ...provided,
        // for previously selected items
        backgroundColor:
          state.isSelected || state.isFocused
            ? "hsl(var(--secondary))"
            : "hsl(var(--background))",
        "&:hover": {
          backgroundColor: "hsl(var(--secondary))",
          color: "hsl(var(--foreground))",
        },
      };
    },
    multiValue: (
      provided: CSSObjectWithLabel,
      state: MultiValueGenericProps<MyOption, true, GroupBase<MyOption>>,
    ) => ({
      ...provided,
      backgroundColor: "hsl(var(--input))", // Example variable, replace with actual
      borderRadius: "10px",
      color: "hsl(var(--foreground))",
    }),
    // Styles for the text part of the tags
    multiValueLabel: (
      provided: CSSObjectWithLabel,
      state: MultiValueGenericProps<MyOption, true, GroupBase<MyOption>>,
    ) => ({
      ...provided,
      color: "hsl(var(--tag-foreground))", // Example variable, replace with actual
    }),
    multiValueRemove: (provided: CSSObject, state: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: `hsl(var(--input))`,
      color: "hsl(var(--muted-foreground))",
      borderRadius: "10px",
      "&:hover": {
        backgroundColor: `hsl(var(--input))`,
        color: `hsl(var(--foreground))`,
      },
    }),
    placeholder: (provided: CSSObject) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      fontSize: "14px",
    }),

    input: (provided: CSSObject) => ({
      ...provided,
      color: "hsl(var(--foreground))",
      fontSize: "14px",
    }),

    // *** Styling the dropdown arrow & its separator ***
    dropdownIndicator: (
      provided: CSSObject,
      state: { isFocused: boolean },
    ) => ({
      ...provided,
      color: state.isFocused
        ? "hsl(var(--foreground))"
        : "hsl(var(--muted-foreground))", // Adjust the color to match your theme
      "&:hover": {
        color: "hsl(var(--foreground))", // Color when the indicator is hovered
      },
    }),
    indicatorSeparator: (provided: CSSObject) => ({
      ...provided,
      backgroundColor: "hsl(var(--input))", // Change this to your desired separator color
    }),
  };

  return (
    <>
      <AsyncSelect
        styles={customStyles}
        placeholder={placeholder}
        cacheOptions
        defaultOptions
        isMulti
        hideSelectedOptions
        loadOptions={loadOptions}
        onChange={changeHandler}
        onInputChange={inputChangeHandler}
        defaultValue={selected}
        components={{ DropdownIndicator: null }}
      />
    </>
  );
};

export default MyDropDown;
