import pandas as pd
import random

df = pd.read_csv("./Dataset.csv")


def pre_process():
    global df

    def replace_price(value):
        if value == "No price available":
            return f"₹ {random.randint(50, 500)}"
        return value

    df["Price"] = df["Price"].apply(replace_price)
    df.to_csv("./Dataset.csv", index=False)


def get_med_data(med_name):
    pattern = '|'.join(med_name.split())
    result = df[df["Medicine_name"].str.contains(
        pattern, case=False, regex=True)]
    med_data = result.to_dict('records')
    return med_data


def med_list():
    return df["Medicine_name"]


if __name__ == "__main__":
    # pre_process()
    result = get_med_data("Doxid")
    print(result)
