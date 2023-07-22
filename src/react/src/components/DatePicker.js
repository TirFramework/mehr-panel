import { Form, DatePicker } from "antd";
import { separationRules } from "../lib/helpers";
import moment from "moment";

const CustomDatePicker = ({ format, onChange, value, ...props }) => {
    return (
        <DatePicker
            {...props}
            format={format}
            onChange={(data) => {
                onChange(data ? moment(data).format('YYYY-MM-DD') : null);
            }}
            value={value ? moment(value, 'YYYY-MM-DD') : null}
        />
    );
};

const Text = (props) => {
    const dateFormat = props.options.dateFormat
        ? props.options.dateFormat
        : "YYYY-MM-DD";

    const picker = props.options.picker ? props.options.picker : "date";

    const rules = separationRules({
        pageType: props.pageType,
        rules: props.rules,
        creationRules: props.creationRules,
        updateRules: props.updateRules,
    });

    return (
        <>
            <Form.Item
                label={props.display}
                name={props.name}
                initialValue={props.value}
                rules={rules}
            >
                <CustomDatePicker
                    format={dateFormat}
                    placeholder={props.options.placeholder}
                    disabled={props.readonly}
                    picker={picker}
                    className={`${props.readonly && "readOnly"} w-full`}
                    style={{ width: "100%" }}
                />
            </Form.Item>
        </>
    );
};

export default Text;
