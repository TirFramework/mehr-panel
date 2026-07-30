import {Transfer} from "antd";

import { separationRules } from "../lib/helpers";
import { LabeledFormItem } from "../lib/fieldLabel";
import {useState} from "react";

const Text = (props) => {
    const [targetKeys, setTargetKeys] = useState(props.value);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    }


  const rules = separationRules({
    pageType: props.pageType,
    rules: props.rules,
    creationRules: props.creationRules,
    updateRules: props.updateRules,
  });



  return (
    <>
      <LabeledFormItem
        display={props.display}
        hideLabel={props.hideLabel}
        inlineLabel={props.inlineLabel}
        options={props.options}
        name={props.name}
        initialValue={targetKeys}
        rules={rules}
      >
          <Transfer
              className={props.readonly && "readOnly"}
              disabled={props.readonly}
              dataSource={props.data}
              titles={['Source', 'Target']}
              targetKeys={targetKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              render={(item) => item.title}
              showSearch
              listStyle={{
                  width: 250,
                  height: 300,
              }}
          />
      </LabeledFormItem>
    </>
  );
};

export default Text;
