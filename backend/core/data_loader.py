import pandas as pd
from datasets.smap_data import columns as smap_columns
from datasets.smap_data import data as smap_data
from datasets.nvdi_data import columns as ndvi_columns
from datasets.nvdi_data import data as ndvi_data
from datasets.gpm_data import columns as gpm_columns
from datasets.gpm_data import data as gpm_data
from datasets.grace_data import columns as grace_columns
from datasets.grace_data import data as grace_data
from datasets.power_data import columns as power_columns
from datasets.power_data import data as power_data
def load_smap_data():
    return pd.DataFrame(smap_data, columns=smap_columns)
def load_ndvi_data():
    return pd.DataFrame(ndvi_data, columns=ndvi_columns)
def load_gpm_data():
    return pd.DataFrame(gpm_data, columns=gpm_columns)
def load_grace_data():
    return pd.DataFrame(grace_data, columns=grace_columns)
def load_power_data():
    return pd.DataFrame(power_data, columns=power_columns)
def load_all_data():
    return {
        "smap": load_smap_data(),
        "ndvi": load_ndvi_data(),
        "gpm": load_gpm_data(),
        "grace": load_grace_data(),
        "power": load_power_data(),
    }
