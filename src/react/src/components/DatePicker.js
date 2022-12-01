
import { Form, DatePicker } from "antd";
import {separationRules} from "../lib/helpers";

const Text = (props) => {

    const rules = separationRules({
        pageType: props.pageType,
        rules: props.rules,
        creationRules: props.creationRules,
        updateRules: props.updateRules,
    });

    const dateFormat = 'YYYY-MM-DD';


    return (
        <>
            <Form.Item
                label={props.label}
                name={props.name}
                initialValue={props.value}
                rules={rules}
            >
                <DatePicker
                    format={dateFormat}
                    placeholder={props.options.placeholder}
                    disabled={props.readonly}
                    className={`${props.readonly && "readOnly"} w-full`}
                    style={{ width: '100%' }}
                />
            </Form.Item>

        </>
    );
};

export default Text;
