import * as React from 'react';
import './calculator.css';
import { forEach, isNil, map, pick, isNaN, isEqual } from 'lodash';

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

interface ResultProps extends StateProps {
	operator: string;
}

interface ResultRef {
	getResult: () => void;
}

const CalculatorResult = React.forwardRef<ResultRef, ResultProps>(
	(props, ref) => {
		const { operator, prev, next } = props;
		const [result, setResult] = React.useState<string>();
		const originProps = React.useRef(props);

		React.useEffect(() => {
			if (!isEqual(originProps.current, props)) {
				setResult('');
				originProps.current = props;
			}
		}, [props]);

		const getResult = React.useCallback(() => {
			setResult(eval(`${Number(prev)}${operator}${Number(next)}`));
		}, [next, operator, prev]);

		React.useImperativeHandle(ref, () => {
			return {
				getResult,
			};
		});

		return (
			<div className={`${prefix}-result`}>
				{`${!prev ? '' : prev + operator}  ${
					!next ? '' : next + ' ='
				} ${!result ? '' : result} `}
			</div>
		);
	}
);

CalculatorResult.displayName = 'CalculatorResult';

interface InputValComProps {
	position: InputEnum;
	value?: number | string;
	onChange: (
		event: React.ChangeEvent<HTMLInputElement>,
		position: InputEnum
	) => void;
}

const InputValCom: React.FC<InputValComProps> = React.memo((props) => {
	const { position, value, onChange } = props;
	const onChangeVal = React.useCallback(
		(event) => onChange(event, position),
		[onChange, position]
	);
	return <input type="number" value={value} onChange={onChangeVal} />;
});

InputValCom.displayName = 'InputValCom';

const Calculator: React.FC<CalendarProps> = () => {
	const [next, setNext] = React.useState<number | string>();
	const [prev, setPrev] = React.useState<number | string>();

	const [operator, setOperator] = React.useState<string>('+');
	const resultRef = React.useRef<ResultRef>(null);

	const onChangeVal = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, key: InputEnum) => {
			const val = event.target.value;
			key === InputEnum.Prev ? setPrev(val) : setNext(val);
		},
		[]
	);

	const onChangeOperator = React.useCallback((e: React.MouseEvent) => {
		const value = e.currentTarget.getAttribute('data-value') ?? '+';
		setOperator(value);
	}, []);

	const onConfirm = React.useCallback(() => {
		let msg = validateIsEmpty({ prev, next });
		!msg && (msg += validateIsNumber({ prev, next }));
		if (!msg && Number(next) === 0 && operator === '/') {
			msg += '分母不能为0';
		}
		if (msg) {
			alert(msg);
		} else {
			resultRef.current?.getResult();
		}
	}, [next, operator, prev]);

	return (
		<div className={prefix}>
			<div className={`${prefix}-container`}>
				<InputValCom
					value={prev}
					position={InputEnum.Prev}
					onChange={onChangeVal}
				/>
				<span>{operator}</span>
				<InputValCom
					value={next}
					position={InputEnum.Next}
					onChange={onChangeVal}
				/>
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
			<CalculatorResult
				ref={resultRef}
				operator={operator}
				prev={prev}
				next={next}
			></CalculatorResult>
		</div>
	);
};

export default Calculator;
