import {isNumber} from 'lodash';

const WrapperKpi = ({
                      params,
                      showSplit = false,
                      len,
                      onClick,
                      valueShowEmpty
                    }: {
  params: any;
  showSplit?: boolean;
  onClick?: Function;
  len?: number;
  valueShowEmpty?: boolean
}) => {
  const node = params.data;
  const result = params.value;
  let numerator = 0; // 分子
  let denominator = 0; // 分母
  if (showSplit) {
    const currentTime = params.column?.colId;
    numerator = node[`${currentTime}_numerator`] ?? 0; // 分子
    denominator = node[`${currentTime}_denominator`] ?? 0; // 分母
  }
  const weight = node?.isDept ? 'bold' : 'initial';
  const data = isNumber(result) && result ? (len ? result.toFixed(len) : result) : 0;
  if (isNumber(result)) {
    if (showSplit)
      return (
        <span>
          <label style={{fontWeight: weight}}>{data}</label>
          <label style={{color: 'gray'}}>
            ({numerator},{denominator})
          </label>
        </span>
      );
    return (
      <span
        style={{
          fontWeight: weight,
          color: onClick && params.value ? '#1890ff' : '#181d1f',
          cursor: onClick && params.value ? 'pointer' : 'initial',
        }}
        onClick={() => {
          if (!params.value) return;
          onClick?.(params);
        }}
      >
        {data}
      </span>
    );
  }
  // null 值是显示空
  if (valueShowEmpty) {
    return "";
  }

  // null 显示为0
  return <span style={{fontWeight: weight, color: node?.isDept ? '#181d1f' : 'silver'}}> 0</span>;
};
export default WrapperKpi;
