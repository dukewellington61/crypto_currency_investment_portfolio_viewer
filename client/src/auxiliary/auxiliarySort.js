export const sortOverViewValuesArray = (overviewValues, index, desc) => {
  let overViewValuesSorted = [];

  if (index === 0) {
    desc
      ? (overViewValuesSorted = overviewValues.sort((a, b) =>
          a[index].localeCompare(b[index])
        ))
      : (overViewValuesSorted = overviewValues.sort((a, b) =>
          b[index].localeCompare(a[index])
        ));
  } else {
    if (desc) {
      overViewValuesSorted = overviewValues.sort(function (a, b) {
        return a[index] - b[index];
      });
    } else {
      overViewValuesSorted = overviewValues.sort(function (a, b) {
        return a[index] - b[index];
      });
      overViewValuesSorted = overViewValuesSorted.reverse();
    }
  }

  // deep clone array, because else no new object is being created (reference to point in memory remains unchanged)
  // so no state update and no re render child component (overviewValues) to reflect updated UI is taking place
  return JSON.parse(JSON.stringify(overViewValuesSorted));
};

export const handleUI = (e) => {
  document
    .querySelectorAll(".fa-sort-up,.fa-sort-down")
    .forEach((element) => element.classList.remove("sort_arrow_big"));

  e.target.classList.add("sort_arrow_big");
};
