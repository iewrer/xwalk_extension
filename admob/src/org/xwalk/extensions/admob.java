package org.xwalk.extensions;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.google.android.gms.ads.*;

import java.util.HashMap;
import java.util.Map;

import org.xwalk.app.runtime.extension.XWalkExtensionClient;
import org.xwalk.app.runtime.extension.XWalkExtensionContextClient;

import org.json.JSONObject;
import org.json.JSONException;

interface Command {
	void runCommand(int instanceId, JSONObject jsonMsg);
}

public class admob extends XWalkExtensionClient {
	private XWalkExtensionContextClient mExtensionContext;
	public static final String NAME = "xwalk.experimental.advertising";
	public static final String JS_API_PATH = "jsapi/Admob_api.api";
	private static final String TAG = "admob";

	private AdView adView;
	private Boolean positionAtTop;

	private static HashMap<String, Command> MethodMap = new HashMap<String, Command>();

	public admob(String name, String JsApiContent, XWalkExtensionContextClient context) {
        super(name, JsApiContent, context);
        mExtensionContext = context;
		initMethodMap();
	}

	public static AdSize adSizeFromSize(String size) {
		if ("BANNER".equals(size)) {
			return AdSize.BANNER;
		} 
		else if ("MEDIUM_RECTANGLE".equals(size)) {
			return AdSize.MEDIUM_RECTANGLE;
		} 
		else if ("FULL_BANNER".equals(size)) {
			return AdSize.FULL_BANNER;
		} 
		else if ("LEADERBOARD".equals(size)) {
			return AdSize.LEADERBOARD;
		} 
		else if ("SMART_BANNER".equals(size)) {
			return AdSize.SMART_BANNER;
		} 
		else {
			return null;
		}
	}

	private void initMethodMap() {
		MethodMap.put("createBannerView", new Command() {
			public void runCommand(int instanceID, JSONObject jsonMsg) {
				String publisherId = "";
				String size = "";
				try {
					publisherId = jsonMsg.getString("publisherId");
					size = jsonMsg.getString("adSize");
					positionAtTop = jsonMsg.getBoolean("positionAtTop");
				}
				catch (JSONException e) {
					Log.e(TAG, e.toString());
				}


				final AdSize adSize = adSizeFromSize(size);

				Runnable runnable = new Runnable() {
					public void run() {
						adView = new AdView(mExtensionContext.getActivity());
						adView.setAdSize(adSize);
						adView.setAdUnitId("myAdUnitId");

						LinearLayout layout = new LinearLayout(mExtensionContext.getActivity());
						if (positionAtTop) {
							layout.addView(adView, 0);
						}
						else {
							layout.addView(adView);
						}
					}
				};
				mExtensionContext.getActivity().runOnUiThread(runnable);
				System.out.println("run successfully!");
			}
		});
	}

    private String getCommandString(String message) {
        if (message.isEmpty()) {
            return "";
        }
        try {
            return new JSONObject(message).getString("cmd");
        } catch(Exception e) {
            e.printStackTrace();
            return "";
        }
    }

	@Override
  	public void onMessage(int instanceID, String message) {
    	Command command = MethodMap.get(getCommandString(message));
         if (null != command) {
             try {
                command.runCommand(instanceID, new JSONObject(message));
                JSONObject jsonOutput = null;
    			JSONObject jsonInput = new JSONObject(message);
       			String cmd = jsonInput.getString("cmd");
                if (!jsonOutput.has("cmd")) jsonOutput.put("cmd", cmd);
            	jsonOutput.put("asyncCallId", jsonInput.getString("asyncCallId"));
           		postMessage(instanceID, jsonOutput.toString());
             } 
             catch (Exception e) {
                 e.printStackTrace();
                 return;
             }
         }
  	}

  	@Override
  	public String onSyncMessage(int instanceID, String message) {
  		return "";
  	}
}