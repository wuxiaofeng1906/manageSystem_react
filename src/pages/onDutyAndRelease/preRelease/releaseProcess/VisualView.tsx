import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import cns from 'classnames';
interface Iitem {
  project: string;
  branch: string;
  server: string[];
  env?: string;
  time: string;
  from?: number;
  to?: number;
}

const thead = ['类别', '线下版本', '集群0', '集群1', '线上'];
const initBg = ['#93db9340', '#e8773c40', '#335d8a59'];
const Item = (params: { data: Iitem; bg?: string; child?: React.ReactNode }) => {
  return (
    <div style={{ background: params.bg || initBg[0] }} className={styles.item}>
      {params.child || <div />}
      <p>发布项目:{params.data.project}</p>
      <p>发布分支:{params.data.branch}</p>
      <p>发布服务:{params.data.server?.join(',')}</p>
      <p>发布集群:{params.data.server?.join(',')}</p>
      <p>计划发布时间:{params.data.time}</p>
      <img
        src={require('../../../../../public/delete_black_2.png')}
        className={styles.deleteIcon}
        onClick={() => {
          console.log(params.data);
        }}
      />
    </div>
  );
};

const VisualView = () => {
  const [online, setOnline] = useState<any[]>([]);
  const [source, setSource] = useState<Iitem[]>([]);
  useEffect(() => {
    setOnline([{ name: '集群2-3' }, { name: '集群4-6' }, { name: '集群7-8' }]);
    setSource([
      {
        time: '2022-09-12 12:32',
        server: ['web', 'h5'],
        project: '自定义门户',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 150,
      },
      {
        time: '2022-09-12 12:32',
        server: ['web', 'app'],
        project: '库存管理',
        branch: 'hotfix',
        env: '',
        from: 1,
        to: 50,
      },
    ]);
  }, []);

  const renderEmptyTD = (len: number) => {
    if (len <= 0) return '';
    const arr = Array.from({ length: len }).fill('1');
    return (
      <>
        {arr.map((it, index) => (
          <td key={index} />
        ))}
      </>
    );
  };

  const memoLen = useMemo(() => online.length || 0, [online]);

  return (
    <div className={styles.visualView}>
      <table
      // style={{ width: `${((memoLen || 1) + 3) * 230 + 70}px` }}
      >
        <thead>
          <tr>
            {thead.map((title) => {
              const isOnline = title == '线上';
              const singleW = 230;
              return (
                <th
                  key={title}
                  rowSpan={isOnline ? 1 : 2}
                  colSpan={isOnline ? memoLen : 1}
                  style={{
                    width: `${
                      title == '类别' ? 70 : isOnline ? singleW * (memoLen || 1) : singleW
                    }px`,
                  }}
                >
                  {title}
                </th>
              );
            })}
          </tr>
          <tr>
            {online.map((it) => (
              <th key={it.name}>{it.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/*这一行需特殊处理*/}
          <tr>
            <th>版本基准</th>
            <td className={styles.obliqueLine} />
            <td>
              <Item
                bg={'#93db9340'}
                data={{
                  time: '2022-09-12 12:32',
                  server: ['web', 'h5'],
                  project: '自定义门户',
                  branch: 'hotfix',
                }}
              />
              <Item
                bg={'#93db9340'}
                data={{
                  time: '2022-09-12 12:32',
                  server: ['web', 'h5'],
                  project: '自定义门户',
                  branch: 'hotfix',
                }}
              />
              <Item
                bg={'#93db9340'}
                data={{
                  time: '2022-09-12 12:32',
                  server: ['web', 'h5'],
                  project: '自定义门户',
                  branch: 'hotfix',
                }}
              />
            </td>
            <td>
              <Item
                data={{
                  time: '2022/09/12 12:32',
                  server: ['web', 'h5'],
                  project: '库存管理',
                  branch: 'hotfix',
                }}
              />
            </td>
            <td>
              <Item
                data={{
                  time: '2022/09/12 12:32',
                  server: ['web', 'h5'],
                  project: '采购管理',
                  branch: 'hotfix',
                }}
              />
            </td>
            {renderEmptyTD(memoLen - 1)}
          </tr>
          <tr>
            <th rowSpan={4}>预发布</th>
            <td>
              <div>
                <Item
                  bg={initBg[1]}
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: 'emergency20220901',
                    branch: 'hotfix',
                  }}
                  child={
                    <div
                      className={cns(styles.dotLineBase, styles.dotLineOrange)}
                      style={{ width: `calc(50% + 7px)` }}
                    />
                  }
                />
              </div>
            </td>
            {renderEmptyTD(memoLen + 2)}
          </tr>
          <tr>
            <td />
            <td>
              <div>
                <Item
                  bg={initBg[2]}
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '自定义',
                    branch: 'hotfix',
                  }}
                  child={
                    <div
                      className={cns(styles.dotLineBase, styles.dotLineBlue)}
                      style={{ width: `calc(50% + 7px)` }}
                    />
                  }
                />
              </div>
            </td>
            {renderEmptyTD(memoLen + 1)}
          </tr>
          <tr>
            <td />
            <td />
            <td>
              <div>
                <Item
                  bg={initBg[2]}
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '采购管理',
                    branch: 'hotfix',
                  }}
                  child={
                    <div
                      className={cns(styles.dotLineBase, styles.dotLineBlue)}
                      style={{ width: `calc(150% + 7px)` }}
                    />
                  }
                />
              </div>
            </td>
            {renderEmptyTD(memoLen)}
          </tr>
          <tr>
            <td>
              <div>
                <Item
                  bg={initBg[2]}
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: 'sprint',
                    branch: 'hotfix',
                  }}
                  child={
                    <div
                      className={cns(styles.dotLineBase, styles.dotLineBlue)}
                      style={{ width: `calc(150% + 7px)` }}
                    />
                  }
                />
              </div>
            </td>
            {renderEmptyTD(memoLen + 2)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default VisualView;
