import { View } from "react-native";
import { LTS } from "./ListingTags.styles";
import { SelectList } from "react-native-dropdown-select-list";
import { useContext, useState } from "react";
import { ListingTagsContext } from "../../context/ListingTagsContext";
import {
  accessoryCategoryTags,
  bottomCategoryTags,
  colorTags,
  occasionTags,
  shoeCategoryTags,
  topCategoryTags,
  typeTags
} from "../../utils/tags";

const ListingTagsForm = () => {
  const {
    setType,
    setCategory,
    setColor,
    setoccasion,
  } = useContext(ListingTagsContext);

  // select list is not listing to `type` from above
  const [typeSelected, setTypeSelected] = useState('');

  return (
    <View style={LTS.tagContainer}>
      <SelectList
        setSelected={(value: string) => {
          setType(value);
          setTypeSelected(value);
        }} 
        data={typeTags} 
        save="value"
        placeholder="type"
        search={false}
        boxStyles={LTS.tagToggle}
        dropdownStyles={LTS.tagDropdown}
        dropdownItemStyles={LTS.tagDropDownItem}
      />
      <SelectList
        setSelected={(value: string) => setCategory(value)} 
        data={
          typeSelected === 'tops'
          ? topCategoryTags
          : typeSelected === 'bottoms'
            ? bottomCategoryTags
            : typeSelected === 'shoes'
              ? shoeCategoryTags
              : accessoryCategoryTags   
        } 
        save="value"
        placeholder="category"
        search={false}
        boxStyles={LTS.tagToggle}
        dropdownStyles={LTS.tagDropdown}
        dropdownItemStyles={LTS.tagDropDownItem}
      />
      <SelectList
        setSelected={(value: string) => setColor(value)} 
        data={colorTags} 
        save="value"
        placeholder="color"
        search={false}
        boxStyles={LTS.tagToggle}
        dropdownStyles={LTS.tagDropdown}
        dropdownItemStyles={LTS.tagDropDownItem}
      />
      <SelectList
        setSelected={(value: string) => setoccasion(value)} 
        data={occasionTags} 
        save="value"
        placeholder="occasion"
        search={false}
        boxStyles={LTS.tagToggle}
        dropdownStyles={LTS.tagDropdown}
        dropdownItemStyles={LTS.tagDropDownItem}
      />
    </View>
  )
}

export default ListingTagsForm;