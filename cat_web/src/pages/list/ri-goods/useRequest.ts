import axiosHttp  from '../../common/http'
import { useEffect, useState } from 'react';

export default <T>(url: string, defaultValue: T[]): [boolean, T[]] => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>(defaultValue);

  useEffect(() => {
    setLoading(true);
    axiosHttp.get(url)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return [loading, data];
};
