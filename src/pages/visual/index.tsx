import React from 'react';
import styles from './index.less';
import cns from 'classnames';
interface Iitem {
  project: string;
  branch: string;
  server: string[];
  time: string;
}
const Item = (pramas: { data: Iitem; bg: string }) => {
  return (
    <div style={{ background: pramas.bg || '#d6dae3' }} className={styles.item}>
      <p>项目:{pramas.data.project}</p>
      <p>分支:{pramas.data.branch}</p>
      <p>服务:{pramas.data.server?.join(',')}</p>
      <p>时间:{pramas.data.time}</p>
    </div>
  );
};
const VisualTable = () => {
  return (
    <div className={styles.visualTable}>
      <table>
        <thead>
          <tr>
            <th>类别</th>
            <th>线下版本</th>
            <th>集群0</th>
            <th>集群1</th>
            <th>线上</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>积压版本</th>
            <td className={styles.obliqueLine} />
            <td>
              <Item
                data={{
                  time: '2022/09/12 12:32',
                  server: ['web', 'h5'],
                  project: '自定义门户',
                  branch: 'hotfix',
                }}
                bg={'#d6dae3'}
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
                bg={'#93db9361'}
              />
              <Item
                data={{
                  time: '2022/09/12 12:32',
                  server: ['web', 'h5'],
                  project: '采购管理',
                  branch: 'hotfix',
                }}
                bg={'#93db9361'}
              />
              <Item
                data={{
                  time: '2022/09/12 12:32',
                  server: ['web', 'h5'],
                  project: '采购管理',
                  branch: 'hotfix',
                }}
                bg={'#93db9361'}
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
                bg={'#93db9361'}
              />
            </td>
          </tr>
          <tr>
            <th rowSpan={4}>预发布</th>
            <td>
              <div>
                <Item
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '采购管理',
                    branch: 'hotfix',
                  }}
                  bg={'#93db9361'}
                />
              </div>
            </td>
            <td>
              <div
                className={cns(styles.dotLineBase, styles.dotLineOrange)}
                style={{ width: `calc(150% + 7px)` }}
              />
            </td>
            <td>
              <div className={cns(styles.dotLineBase, styles.dotLineOrangeThree)} />
            </td>
            <td />
          </tr>
          <tr>
            <td />
            <td>
              <div>
                <Item
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '采购管理',
                    branch: 'hotfix',
                  }}
                  bg={'#93db9361'}
                />
              </div>
            </td>
            <td>
              <div
                className={cns(styles.dotLineBase, styles.dotLineBlue)}
                style={{ width: `calc(150% + 7px)` }}
              />
            </td>
            <td />
          </tr>
          <tr>
            <td />
            <td />
            <td>
              <div>
                <Item
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '采购管理',
                    branch: 'hotfix',
                  }}
                  bg={'#93db9361'}
                />
              </div>
            </td>
            <td>
              <div className={cns(styles.dotLineBase, styles.dotLineBlue)} />
            </td>
          </tr>
          <tr>
            <td>
              <div>
                <Item
                  data={{
                    time: '2022/09/12 12:32',
                    server: ['web', 'h5'],
                    project: '采购管理',
                    branch: 'hotfix',
                  }}
                  bg={'#93db9361'}
                />
              </div>
            </td>
            <td>
              <div className={cns(styles.dotLineBase, styles.dotLineBlue)} />
            </td>
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default VisualTable;
