import matchSorter from "match-sorter";

function filterSort(options, candidate) {
  let finalOptions = options;

  if (candidate) {
    finalOptions = matchSorter(options, candidate, { keys: ["value"] });

    finalOptions = finalOptions.filter(item => {
      return item.value.indexOf(candidate) >= 0;
    });
  }

  return finalOptions;
}

export default filterSort;
