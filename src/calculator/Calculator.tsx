import * as React from 'react';
import './calculator.css';
import { forEach, isNil, map, pick, isNaN } from 'lodash';

interface CalendarProps {
	value?: string | number;
	onChange?: (val: string) => void;
}

const prefix = 'demo-calculator';

const operators = ['+', '-', '*', '/'];

interface StateProps {
	prev?: number | string;
	next?: number | string;
}

enum InputEnum {
	Prev = 'prev',
	Next = 'next',
}

const NUM_TEXT_MAP = {
	[`${InputEnum.Prev}`]: '一',
	[`${InputEnum.Next}`]: '二',
};

const defaultInputVals = {
	prev: undefined,
	next: undefined,
};

const isValidNum = (v: number | string | undefined) => isNaN(Number(v));

const validateIsEmpty = (state: StateProps) => {
	return validate(state, isNil, '不能为空');
};

const validateIsNumber = (state: StateProps) => {
	return validate(state, isValidNum, '不能为非数字');
};

const validate = (
	state: StateProps,
	validator: (val: number | string | undefined) => boolean,
	errMsg: string
) => {
	const pickState = { ...defaultInputVals, ...pick(state, ['prev', 'next']) };
	let msg = '';
	forEach(pickState, (v, k) => {
		return validator(v) ? (msg += `第${NUM_TEXT_MAP[k]}个值${errMsg}`) : '';
	});
	return msg;
};

const Calculator: React.FC<CalendarProps> = () => {
	const [state, setState] = React.useState<StateProps>({});
	const [operator, setOperator] = React.useState<string>('+');
	const [result, setResult] = React.useState<string>();

	const onChangeVal = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, key: InputEnum) => {
			const val = event.target.value;
			setState((state) => ({ ...(state ?? {}), [key]: val }));
			setResult('');
		},
		[]
	);

	const onChangeOperator = React.useCallback((e: React.MouseEvent) => {
		const value = e.currentTarget.getAttribute('data-value') ?? '+';
		setOperator(value);
		setResult('');
	}, []);

	const onConfirm = React.useCallback(() => {
		let msg = validateIsEmpty(state);
		!msg && (msg += validateIsNumber(state));
		if (!msg && Number(state.next) === 0 && operator === '/') {
			msg += '分母不能为0';
		}
		if (msg) {
			alert(msg);
		} else {
			setResult(
				eval(`${Number(state.prev)}${operator}${Number(state.next)}`)
			);
		}
	}, [operator, state]);

	const noResult = isNil(state.prev) && isNil(state.next);
	return (
		<div className={prefix}>
			<div className={`${prefix}-container`}>
				<input
					type="number"
					value={state?.prev}
					onChange={(event) => onChangeVal(event, InputEnum.Prev)}
				></input>
				<span>{operator}</span>
				<input
					type="number"
					value={state?.next}
					onChange={(event) => onChangeVal(event, InputEnum.Next)}
				></input>
				<button onClick={onConfirm}>确定</button>
				<div className={`${prefix}-operator`}>
					{map(operators, (o) => (
						<button
							data-value={o}
							key={o}
							onClick={onChangeOperator}
						>
							{o}
						</button>
					))}
				</div>
			</div>
			{!noResult && (
				<div className={`${prefix}-result`}>
					{`${!state.prev ? '' : state?.prev} ${operator}  ${
						!state.next ? '' : state?.next + ' ='
					} ${!result ? '' : result} `}
				</div>
			)}
		</div>
	);
};

export default Calculator;
