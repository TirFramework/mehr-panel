import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import de from 'react-phone-input-2/lang/de.json'
import {Form} from "antd";
import {separationRules} from "../lib/helpers";

const App = (props) => {
    const rules = separationRules({
        pageType: props.pageType,
        rules: props.rules,
        creationRules: props.creationRules,
        updateRules: props.updateRules,
    });

    return (

    <Form.Item
        label={props.display}
        name={props.name}
        initialValue={props.value}
        rules={rules}

    >
        <PhoneInput
            placeholder={props.options.placeholder}
            disabled={props.readonly}
            className={props.readonly && "readOnly"}
            country={'ir'}
            localization={props.options.locale}
        />
    </Form.Item>
    );
};

export default App;
